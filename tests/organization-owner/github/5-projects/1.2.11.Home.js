'use strict';

var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Home Dashboard';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var runId;
var projectId;
var shippable;
var accountId = '';
var allowedProjectIds = [];
var project = '';
var providerId = '';
var branches = [];
var run;

describe('Home Dashboard',
  function() {
    describe(testSuite,
      function () {
        it('Get ProjectAccounts',
          function (done) {
            this.timeout(0);
            accountId = nconf.get('shiptest-github-owner:accountId');
            shippable = new Shippable(global.config.apiToken);
            var query = util.format('accountIds=%s', accountId);
            shippable.getProjectAccounts(query,
              function (err, projAccounts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Get ProjectAccounts for accountId:' +
                      ' %s failed with error: %s', testSuiteDesc, accountId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (!_.isEmpty(projAccounts))
                    allowedProjectIds =
                      _.uniq(_.pluck(projAccounts, 'projectId'));
                  logger.debug('ProjectAccounts fetched successfully');
                  return done();
                }
              }
            );
          }
        );

        it('Get Enabled Projects',
          function (done) {
            this.timeout(0);
            var query = 'autoBuild=true';
            if (!_.isEmpty(allowedProjectIds))
              query += util.format('&projectIds=%s',
                allowedProjectIds.join(',')
              );
            shippable.getProjects(query,
              function (err, projects) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  project = _.first(projects);
                  providerId = project.providerId;
                  branches = project.branches;
                  projectId = project.id;
                  logger.debug('Fetched projects successfully');
                  return done();
                }
              }
            );
          }
        );

        it('Get Provider',
          function (done) {
            this.timeout(0);
            shippable.getProviderById(providerId,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get providerById failed for ProvideId: %s' +
                      ' with error: %s', testSuiteDesc, providerId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Fetched provider successfully');
                  return done();
                }
              }
            );
          }
        );

        it('Get Run Status By accountId',
          function (done) {
            this.timeout(0);
            var query = 'isGitTag=false';
            shippable.getRunStatusByAccountId(accountId, query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get runs status by accId failed with error:'+
                      ' %s for accountId: %s', testSuiteDesc, err, accountId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Fetched Run Status By accountId: '+ accountId);
                  return done();
                }
              }
            );
          }
        );

        it('Get inflight runs',
          function (done) {
            var query = 'status=incomplete';
            if (!_.isEmpty(allowedProjectIds))
              query += util.format('&projectIds=%s',
                allowedProjectIds.join(','));
            shippable.getRuns(query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting inflight runs failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      allowedProjectIds, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (!_.isEmpty(runs)) {
                    run = _.first(runs);
                    runId = run.id;
                  }
                  logger.debug('Inflight runs fetched');
                  return done();
                }
              }
            );
          }
        );

        it('Cancel run',
          function (done) {
            if (!runId) return done();
            shippable.cancelRunById(runId,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Cancelling run runId: %s failed with ' +
                      'error: %s', testSuiteDesc, runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Run successfully cancelled');
                  return done();
                }
              }
            );
          }
        );

        it('Get RunById',
          function (done) {
            if (!runId) return done();
            var query = util.format('runIds=%s', runId);
            shippable.getRuns(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting runs failed for runId: %s ' +
                      'failed with error: %s', testSuiteDesc,
                      runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Run fetched');
                  return done();
                }
              }
            );
          }
        );

        it('Get Runs for runFilter for commit and pull requests',
          function (done) {
            var runFilter = 'all';
            var branchFilter = branches;
            var query = util.format('%sstatus=complete&' +
              'limit=1&projectIds=%s&branch=%s', runFilter, projectId,
              branchFilter.join(','));
            shippable.getRuns(query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting runs failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Runs fetches successfully');
                  return done();
                }
              }
            );
          }
        );

        it('Get Runs for runFilter for commit only',
          function (done) {
            var runFilter = 'commit';
            var branchFilter = branches;
            var query = util.format('%sstatus=complete&' +
              'limit=1&projectIds=%s&branch=%s', runFilter, projectId,
              branchFilter.join(','));
            shippable.getRuns(query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting runs failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Runs fetched successfully');
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('Should run after above test suites',
      function () {
        it('Creating Github Issue if test cases failed',
          function (done) {
            this.timeout(0);
            if (isTestFailed) {
              var githubAdapter =
                new adapter(config.githubToken, config.githubUrl);
              var title = util.format('Failed test suite %s', testSuite);
              var body = util.format(
                'Failed test cases are:\n%s',testCaseErrors);
              var data = {
                title: title,
                body: body
              };
              githubAdapter.pushRespositoryIssue('deepikasl', 'VT1', data,
                function(err) {
                  if (err)
                    logger.warn("Creating Issue failed with error: ", err);
                  return done();
                }
              );
            } else {
              return done();
            }
          }
        );
      }
    );
  }
);

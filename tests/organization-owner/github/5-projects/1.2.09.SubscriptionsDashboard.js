'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Subscriptions Dashboard';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';
var run = {};
var runId;
var projs = {};

describe('Subscriptions Dashboard',
  function () {

    describe(testSuite,
      function () {

        it('Get Projects',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            subscriptionId = nconf.get('shiptest-GITHUB_ORG_1:subscriptionId');
            var query = 'subscriptionIds=' + subscriptionId;
            shippable.getProjects(query,
              function (err, projects) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s for subscriptionId: %s' +
                      testSuiteDesc, err, subscriptionId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  projs = projects;
                  logger.debug('Fetched projects By SubscriptionId: '+ subscriptionId);
                  return done();
                }
              }
            );
          }
        );

        it('Get Run Status By SubscriptionId',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = 'type=ci&isGitTag=false';
            shippable.getRunStatusBySubscriptionId(subscriptionId, query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s for subscriptionId: %s' +
                      testSuiteDesc, err, subscriptionId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  run = _.first(runs);
                  runId = run.id;
                  logger.debug('Fetched projects By SubscriptionId: '+ subscriptionId);
                  return done();
                }
              }
            );
          }
        );

        it('Trigger New Build',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var projectId = run.projectId;
            var payload = {
              projectId: projectId,
              branchName: run.branchName,
              type: 'push'
            };
            shippable.triggerNewBuildByProjectId(projectId, payload,
              function (err, msg) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s trigger new build failed for projectId: $s'+
                      'with error: %s' + testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  runId = msg.runId;
                  logger.debug('Triggered new build for projectId: '+ projectId);
                  return done();
                }
              }
            );
          }
        );

        it('Get inflight runs',
          function (done) {
            var shippable = new Shippable(config.apiToken);
            var query = util.format('type=ci&status=incomplete&subscriptionIds=',
              subscriptionId);
            shippable.getRuns(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting inflight runs failed for ' +
                      'subscriptionId: %s failed with error: %s', testSuiteDesc,
                      subscriptionId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Inflight runs fetched');
                  return done();
                }
              }
            );
          }
        );

        it('wireDeleteRunGetTop',
          function (done) {
            var shippable = new Shippable(config.apiToken);
            var project = _.findWhere(projs, {id: run.projectId});
            if (project.propertyBag && project.propertyBag.dashboardBranchSettings) {
              var dashSettings = project.propertyBag.dashboardBranchSettings;
              var query =util.format('&status=complete&' +
                'limit=1&projectIds=%s&branch=%s', project.id,
                  dashSettings.branchFilter.join(','));
              shippable.getRuns(query,
                function (err) {
                  if (err) {
                    isTestFailed = true;
                    var testCase =
                      util.format(
                        '\n - [ ] %s wireDeleteRunGetTop failed for ' +
                        'projectId: %s failed with error: %s', testSuiteDesc,
                        project.id, err);
                    testCaseErrors.push(testCase);
                    assert.equal(err, null);
                    return done();
                  } else {
                    logger.debug('wireDeleteRunGetTop successfull');
                    return done();
                  }
                }
              );
            } else {
              logger.debug('Dashboard settings not found for projectId:' , project.id)
              return done();
            }
          }
        );

        it('Put buildById',
          function (done) {
            if (run.isRun) return done();
            if (!runId) return done();
            var shippable = new Shippable(config.apiToken);
            var payload = {
              statusCode: 4006
            };
            shippable.putBuildById(runId, payload,
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
                  logger.debug('Successfully put buildById');
                  return done();
                }
              }
            );
          }
        );

        it('Cancel run',
          function (done) {
            if (!run.isRun) return done();
            if (run.statusCode === 30) return done();
            if (!runId) return done();
            var shippable = new Shippable(config.apiToken);
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

        it('Get runById',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = util.format('runIds=%s',runId);
            shippable.getRuns(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                       '\n - [ ] %s get runById failed for runId: $s'+
                      'with error: %s' + testSuiteDesc, runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  runId = _.first(res).id;
                  logger.debug('Fetched run by id for runId:', runId);
                  return done();
                }
              }
            );
          }
        );

        it('Get Run Status By SubId',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = 'type=ci&isGitTag=false&status=complete';
            shippable.getRunStatusBySubscriptionId(subscriptionId, query,
              function (err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get runs status by subId failed with error: '+
                      '%s for subscriptionId: %s' +
                      testSuiteDesc, err, subscriptionId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  run = _.first(runs);
                  runId = run.id;
                  logger.debug('Fetched Run Status By SubId: '+ subscriptionId);
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

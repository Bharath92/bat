'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Subscription History';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var projectId = '';
var runId = '';
var shippable;
var subscriptionId = '';
var run = {};

describe('Subscription History',
  function() {

    describe(testSuite,
      function () {

        it('Get SubscriptionsById',
          function (done) {
            this.timeout(0);
            subscriptionId = nconf.get('shiptest-GITHUB_ORG_1:subscriptionId');
            shippable = new Shippable(config.apiToken);
            shippable.getSubscriptionById(subscriptionId,
              function (err, sub) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Failed to get subscription for subscriptionId:' +
                      ' %s failed with error: %s', testSuiteDesc, subscriptionId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Get SubscriptionById successful for : ' +
                    subscriptionId);
                  subscriptionId = sub.id;
                  return done();
                }
              }
            );
          }
        );

        it('Get ProjectsById',
          function (done) {
            this.timeout(0);
            projectId = nconf.get('shiptest-GITHUB_ORG_1:projectId');
            shippable.getProjectById(projectId,
              function (err, proj) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Failed to get project for projectId:' +
                      ' %s failed with error: %s', testSuiteDesc, projectId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Get ProjectsById successful for : ' + projectId);
                  projectId = proj.id;
                  return done();
                }
              }
            );
          }
        );

        it('Get Runs',
          function (done) {
            this.timeout(0);
            var query = util.format('type=ci&projectIds=%s&status=complete' +
              '&limit=21&sortBy=createdAt,runNumber&sortOrder=-1,-1',
              projectId);
            shippable.getRuns(query,
              function(err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get runs, failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (runs.status<200 || runs.status>=299)
                    logger.warn('status is::',runs.status);
                  run = _.first(runs);
                  return done();
                }
              }
            );
          }
        );

        it('Trigger new build request',
          function (done) {
            this.timeout(0);
            var payload = {
              runId: run.id
            };
            shippable.triggerNewBuildByProjectId(run.projectId, payload,
              function (err, run) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Trigger new build request for projectId:' +
                      ' %s failed with error: %s', testSuiteDesc, run.projectId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Triggered new build with runId: ' + run.runId);
                  nconf.set('shiptest-GITHUB_ORG_1:runId', run.runId);
                  nconf.save(function (err) {
                    if (err)
                      logger.debug('Failed');
                    return done();
                  });
                }
              }
            );
          }
        );

        it('Get RunsById',
          function (done) {
            this.timeout(0);
            var query = util.format('runIds=' + run.id);
            shippable.getRuns(query,
              function(err, runs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get runs, failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (runs.status<200 || runs.status>=299)
                    logger.warn('status is::',runs.status);
                  run = _.first(runs);
                  runId = run.id;
                  return done();
                }
              }
            );
          }
        );

        it('Delete Run',
          function (done) {
            this.timeout(0);
            shippable.deleteRunById(runId,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s delete run failed with error: %s' +
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Run Deleted');
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
                function(err, res) {
                  if (err)
                    logger.warn('Creating Issue failed with error: ', err);
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

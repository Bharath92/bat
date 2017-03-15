'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Project History';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var projectId = '';
var runId = '';
var shippable;
var run = {};

describe('Project History',
  function() {

    describe(testSuite,
      function () {

        it('Get ProjectsById',
          function (done) {
            this.timeout(0);
            projectId = nconf.get('shiptest-GITHUB_ORG_1:projectId');
            shippable = new Shippable(config.apiToken);
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
            var query = util.format('projectIds=%s&status=complete' +
              '&limit=21&sortBy=runNumber&sortOrder=-1&skip=0',
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
                  return done();
                }
              }
            );
          }
        );

        it('Get RunsById',
          function (done) {
            this.timeout(0);
            var query = util.format('runIds=%s', run.id);
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

        it('Trigger new build request',
          function (done) {
            this.timeout(0);
            var payload = {
              runId: run.id
            };
            shippable.triggerNewBuildByProjectId(projectId, {},
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
                  runId = run.runId;
                  return done();
                }
              }
            );
          }
        );

        it('Get JobStatesMap',
          function (done) {
            this.timeout(0);

            var query = util.format('projectIds=%s', projectId);
            shippable.getJobStateMaps(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Get JobStatesMap for projectId:' +
                      ' %s failed with error: %s', testSuiteDesc, projectId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('Get Runs',
          function (done) {
            this.timeout(0);
            var bag = {
              runId : runId,
              isStatusCompleted: false
            };

            bag.timeoutLength = 1;
            bag.timeoutLimit = 180;

            _getRunById(bag, done);
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

function _getRunById (bag, done) {
  shippable.getRunById(bag.runId,
    function(err, run) {
      if (err) {
        isTestFailed = true;
        var testCase =
          util.format(
            '\n- [ ] %s: Get runs, failed with error: %s',
            testSuiteDesc, err);
        bag.isStatusCompleted = true;
        testCaseErrors.push(testCase);
        assert.equal(err, null);
        return done();
      } else {
        if (run.statusCode >= 30 && run.statusCode <= 90 )
          bag.isStatusCompleted = true;

        if (!bag.isStatusCompleted) {
          bag.timeoutLength *= 2;
          if (bag.timeoutLength > bag.timeoutLimit)
            bag.timeoutLength = 1;

          setTimeout(function () {
            _getRunById(bag, done);
          }, bag.timeoutLength * 1000);
        }
        if (bag.isStatusCompleted)
          return done();
      }
    }
  );
}

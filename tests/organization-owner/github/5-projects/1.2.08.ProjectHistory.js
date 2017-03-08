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
            var pathToJson = process.cwd() + '/config.json';
            nconf.argv().env().file({file: pathToJson});
            nconf.load();
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
                  console.log("Trigger new build request run ::",run);
                  logger.debug('Triggered new build with runId: ' + run.runId);
                  return done();
                }
              }
            );
          }
        );

        it('Get Runs',
          function (done) {
            this.timeout(0);
            var query = util.format('projectIds=%s', projectId);
            var bag = {
              query : query,
              status: false
            };

            var timer = setInterval(function () {
              async.series([
                  _getRuns.bind(null, bag)
                ],
                function (err) {
                  if (err)
                    logger.error('Failed', err);
                  else
                    logger.verbose('Successful');
                  if (bag.status) {
                    clearInterval(timer);
                    return done();
                  }
                }
              );
            }, 120000);
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

function _getRuns (bag, next) {
  shippable.getRuns(bag.query,
    function(err, runs) {
      if (err) {
        isTestFailed = true;
        var testCase =
          util.format(
            '\n- [ ] %s: Get runs, failed with error: %s',
            testSuiteDesc, err);
        bag.status = true;
        testCaseErrors.push(testCase);
        assert.equal(err, null);
        return next();
      } else {
        if (runs.status<200 || runs.status>=299)
          logger.warn('status is::',runs.status);
        run = _.first(runs);
        if (run.statusCode >= 30 && run.statusCode <= 90 )
          bag.status = true;
        return next();
      }
    }
  );
}

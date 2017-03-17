'use strict';

var nconf = require('nconf');
var chai = require('chai');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Projects Dashboard';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var runId;
var projectId;
var shippable;

describe('Projects Dashboard',
  function() {
    describe(testSuite,
      function () {
        it('Trigger new build request',
          function (done) {
            this.timeout(0);
            projectId = nconf.get('shiptest-GITHUB_ORG_1:projectId');
            if (!projectId) return done();

            shippable = new Shippable(global.config.apiToken);
            shippable.triggerNewBuildByProjectId(projectId, {},
              function (err, run) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Trigger new build request for projectId:' +
                      ' %s failed with error: %s', testSuiteDesc, projectId,
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
        it('Get inflight runs',
          function (done) {
            var query = util.format('projectIds=%s&status=incomplete',
              projectId);
            shippable.getRuns(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting inflight runs failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      projectId, err);
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
        it('Get branch run status',
          function (done) {
            if (!runId) return done();
            if (!projectId) return done();

            var query = 'isGitTag=false';
            shippable.getBranchStatusByProjectId(projectId, query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Getting branch run status failed for ' +
                      'projectId: %s failed with error: %s', testSuiteDesc,
                      projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Branch run status successfully fetched');
                  return done();
                }
              }
            );
          }
        );
        it('Get run by id',
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

'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var _ = require('underscore');
var chai = require('chai');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Runs Console';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum, testSuiteDesc);
var shippable;
var isTestFailed = false;
var testCaseErrors = [];
var runId;
var run;
var jobs = [];

describe('Runs Console',
  function () {

    describe(testSuite,
      function () {

        it('Get Jobs',
          function (done) {
            this.timeout(0);
            runId = nconf.get('shiptest-GITHUB_ORG_1:runId');
            var query = 'runIds=' + runId;
            shippable = new Shippable(config.apiToken);
            shippable.getJobs(query,
              function (err, resJobs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get jobs failed with error: %s for runId: %s',
                      testSuiteDesc, err, runId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  jobs = resJobs;
                  logger.debug('Fetched jobs By RunId: ' + runId);
                  return done();
                }
              }
            );
          }
        );

        it('Get JobConsoles By JobId',
          function (done) {
            this.timeout(0);
            async.each(jobs,
              function(job, nextJob) {
                shippable.getJobConsolesByJobId(job.id,
                  function(err) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: get JobConsoles failed with error: %s',
                          testSuite, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextJob();
                    } else {
                      return nextJob();
                    }
                  }
                );
              },
              function () {
                return done();
              }
            );
          }
        );

        it('Trigger New Build',
          function (done) {
            this.timeout(0);
            var job = _.first(jobs);
            var projectId = job.projectId;
            var payload = {
              projectId: projectId,
              branchName: job.branchName,
              type: 'push'
            };
            shippable.triggerNewBuildByProjectId(projectId, payload,
              function (err, msg) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s trigger new build failed for projectId: $s'+
                      'with error: %s', testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  runId = msg.runId;
                  logger.debug('Triggered new build for projectId: ' +
                    projectId);
                  nconf.set('shiptest-GITHUB_ORG_1:runId', runId);
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

        it('Get runById',
          function (done) {
            this.timeout(0);
            var query = util.format('runIds=%s', runId);
            shippable.getRuns(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                       '\n - [ ] %s get runById failed for runId: $s'+
                      'with error: %s', testSuiteDesc, runId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  run = _.first(res);
                  logger.debug('Fetched run by id for runId: ' + runId);
                  return done();
                }
              }
            );
          }
        );

        it('Cancel run',
          function (done) {
            if (!run.isRun) return done();
            if (run.statusCode !== 0 || run.statusCode !== 10 ||
              run.statusCode !== 20 ) return done();
            if (!run.id) return done();
            shippable.cancelRunById(run.id,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Cancelling run runId: %s failed with ' +
                      'error: %s', testSuiteDesc, run.id, err);
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
                'Failed test cases are:\n%s', testCaseErrors);
              var data = {
                title: title,
                body: body
              };
              githubAdapter.pushRespositoryIssue('deepikasl', 'VT1', data,
                function(err) {
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

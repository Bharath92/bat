'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var async = require('async');
var testSuiteNum = '1.';
var testSuiteDesc = 'Runs Coverage';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var shippable;
var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';
var run;
var jobs;
var job;
var previousRun;

describe('Runs Coverage',
  function () {
    describe(testSuite,
      function () {
        it('Get Runs',
          function (done) {
            this.timeout(0);
            shippable = new Shippable(config.apiToken);
            var query = '';
            shippable.getRuns(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get runs failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                var runs = res;
                run = _.first(runs);
                logger.debug('Fetched runs successfully');
                return done();
              }
            );
          }
        );

        it('Get Jobs',
          function (done) {
            this.timeout(0);
            var query = util.format('runIds=%s', run.id);
            shippable.getJobs(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get jobs failed with error: %s for runId: %s',
                      testSuiteDesc, err, run.id);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                jobs = res;
                job = _.first(jobs);
                logger.debug('Fetched jobs By runId: '+ run.id);
                return done();
              }
            );
          }
        );

        it('Get Coverage Reports',
          function (done) {
            this.timeout(0);
            var failedJobId;
            var query = util.format('jobIds=%s', job.id);
            shippable.getCoverageReports(query,
              function (err) {
                if (err) {
                  failedJobId = job.id;
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get job coverage reports failed with error: %s for jobId: %s' +
                      testSuiteDesc, err, failedJobId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                logger.debug('Fetched coverage reports for jobId: '+ job.id);
                return done();
              }
            );
          }
        );

        it('Get Previous Runs',
          function (done) {
            this.timeout(0);
            var query = util.format('projectIds=%s&status=30&limit=10' +
              '&sortBy=runNumber&sortOrder=-1&maxRunNumber=%s&branch=%s',
              job.projectId,
              job.runNumber + 1,
              job.branchName);
            shippable.getRuns(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get previous runs failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                var previousRuns = res;
                previousRun = _.first(previousRuns);
                logger.debug('Fetched previous runs successfully');
                return done();
              }
            );
          }
        );

        it('Get Complete Jobs',
          function (done) {
            if(_.isEmpty(previousRun)) return done();
            this.timeout(0);
            var query = util.format('runIds=%s', previousRun.id);
            shippable.getJobs(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get completed jobs failed with error: %s for runId: %s',
                      testSuiteDesc, err, previousRun.id);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                jobs = res;
                job = _.first(jobs);
                logger.debug('Fetched completed jobs for runId: '+ previousRun.id);
                return done();
              }
            );
          }
        );

        it('Get Reports By JobId',
          function (done) {
            if(_.isEmpty(previousRun)) return done();
            this.timeout(0);
            shippable.getReportsByJobId(job.id,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get reports by jobId failed with error: %s for jobId: %s',
                      testSuiteDesc, err, job.id);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                var reportFiles = res;
                logger.debug('Fetched reports for jobId: '+ job.id);
                return done();
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

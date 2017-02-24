'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var async = require('async');
var testSuiteNum = '1.';
var testSuiteDesc = 'Runs Tests';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var shippable;
var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';
var runId;
var jobIds = [];
var jobs;

describe('Runs Tests',
  function () {

    describe(testSuite,
      function () {

        it('Get Jobs',
          function (done) {
            this.timeout(0);
            var pathToJson = process.cwd() + '/config.json';
            nconf.argv().env().file({file: pathToJson});
            nconf.load();
            shippable = new Shippable(config.apiToken);
            runId = nconf.get("shiptest-GITHUB_ORG_1:runId");
            var query = util.format('runIds=%s', runId);
            shippable.getJobs(query,
              function (err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get jobs failed with error: %s for runId: %s',
                      testSuiteDesc, err, runId);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                jobs = res;
                jobIds = _.pluck(jobs, 'id');
                logger.debug('Fetched jobs By runId: '+ runId);
                return done();
              }
            );
          }
        );

        it('Get Job Test Reports',
          function (done) {
            this.timeout(0);
            var failedJobId;
            async.each(jobIds,
              function (jobId, nextJobId) {
                var query = util.format('jobIds=%s', jobId);
                shippable.getJobTestReports(query,
                  function (err) {
                    if (err) {
                      failedJobId = jobId;
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n - [ ] %s get job test reports failed with error: %s for jobId: %s' +
                          testSuiteDesc, err, failedJobId);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextJobId();
                    }
                    return nextJobId();
                  }
                );
              },
              function () {
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

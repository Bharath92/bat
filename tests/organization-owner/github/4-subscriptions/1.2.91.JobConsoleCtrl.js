'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Job Console';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var resource = {};
var subscriptionId = '';
var jobsVm = [];
var buildId = '';
var resourceId = '';
var buildJobId = '';

describe(testSuite,
  function () {

    describe('Job Consoles Controller',
      function () {
        it('Organization-Owner-github-getSubscription',
          function (done) {
            this.timeout(0);
            shippable = new Shippable(config.apiToken);
            var query = util.format('subscriptionOrgNames=%s',nconf.get("GITHUB_ORG_1"));
            shippable.getSubscriptions(query,
              function(err, subscriptions) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get subscriptions, failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (subscriptions.status<200 || subscriptions.status>=299)
                    logger.warn("status is::",subscriptions.status);
                  subscriptionId = _.first(subscriptions).id;
                  return done();
                }
              }
            );
          }
        );

        it('get resources',
          function (done) {
            this.timeout(0);

            var query = util.format('isDeleted=false&subscriptionIds=%s',
              subscriptionId);
            shippable.getResources(query,
              function(err, resources) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get resources failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  jobsVm = _.where(resources, {"isJob": true});
                  return done();
                }
              }
            );
          }
        );

        it('get Builds By resourceId',
          function (done) {
            this.timeout(0);

            resourceId = _.first(jobsVm).id;
            var query = util.format('resourceIds=%s', resourceId);
            shippable.getBuilds(query,
              function(err, builds) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuilds failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (!_.isEmpty(builds))
                    buildId = _.first(builds).id;
                  return done();
                }
              }
            );
          }
        );

        it('get BuildJobs',
          function (done) {
            this.timeout(0);

            var query = util.format('buildIds=%s', buildId);
            shippable.getBuildJobs(query,
              function(err, buildJobs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuildJobs failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (!_.isEmpty(buildJobs))
                    buildJobId = _.first(buildJobs).id;
                  return done();
                }
              }
            );
          }
        );

        it('get BuildJobConsoles By BuildJobId',
          function (done) {
            this.timeout(0);

            if (!buildJobId) return done();
            var query = util.format('buildIds=%s', buildId);
            shippable.getBuildJobConsolesByBuildJobId(buildJobId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuildJobConsolesByBuildJobId failed' +
                      'with error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
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
                function(err, res) {
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

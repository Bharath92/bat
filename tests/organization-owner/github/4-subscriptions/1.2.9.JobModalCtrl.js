'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Job Modal';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var subscriptionId = '';
var jobsVm = [];
var buildId = '';
var projectId = '';
var versionNavPageLimit = 20;
var versionNavCurrentPage = 1;
var resourceId = '';
var versionList = [];
var versionsToGet = [];

describe(testSuite,
  function () {

    describe('Job Modal Controller',
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

                  if (_.isEmpty(subscriptions)) {
                    logger.warn('No subscriptions found, skipping subsequent ' +
                      'testcases');
                    assert.equal(subscriptions, 1);
                  } else
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
                  if (_.isEmpty(resources)){
                    logger.warn('getResources returned 0 resources');
                    assert.equal(resources, 1);
                  }
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

            if (_.isEmpty(jobsVm)) return done();

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

        it('get Build By id',
          function (done) {
            this.timeout(0);

            if (!buildId) return done();

            shippable.getBuildById(buildId,
              function(err, build) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuilds failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else{
                  if (build.projectId)
                    projectId = build.projectId;
                  return done();
                }
              }
            );
          }
        );

        it('get BuildJobs',
          function (done) {
            this.timeout(0);

            if (!projectId) return done();
            var query = util.format('buildIds=%s&projectIds=%s',
              buildId, projectId);
            shippable.getBuildJobs(query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuildJobs failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get builds',
          function (done) {
            this.timeout(0);

            if (!resourceId) return done();
            var skip = (versionNavCurrentPage - 1) * versionNavPageLimit;
            var query = util.format(
              'resourceIds=%s&subscriptionIds=%s&limit=%d&skip=%d',
              resourceId, subscriptionId, versionNavPageLimit, skip);

            shippable.getBuilds(query,
              function(err, builds) {
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
                  versionsToGet =
                    _.without(_.pluck(builds, 'versionId'), null);
                  var versionsPresent = _.pluck(versionList, 'id');
                  versionsToGet = _.difference(versionsToGet, versionsPresent);
                  return done();
                }
              }
            );
          }
        );

        it('get Versions for all builds',
          function (done) {
            this.timeout(0);

            if (_.isEmpty(versionsToGet)) return done();
            if (!resourceId) return done();

            var query = util.format('resourceIds=%s&subscriptionIds=%s&versionIds=%s',
              resourceId, subscriptionId, versionsToGet);
            shippable.getVersions(query,
              function(err, versions) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getVersions failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  versionList = versionList.concat(versions);
                  return done();
                }
              }
            );
          }
        );

        it('trigger New Build By ResourceId',
          function (done) {
            this.timeout(0);

            if (!resourceId) return done();

            shippable.triggerNewBuildByResourceId(resourceId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: triggerNewBuildByResourceId failed with ' +
                      'error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('put Build By Id',
          function (done) {
            this.timeout(0);

            if (!buildId) return done();
            shippable.putBuildById(buildId, {},
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: putBuildById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get Build By Id',
          function (done) {
            this.timeout(0);

            if (!buildId) return done();
            shippable.getBuildById(buildId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuildById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('pause Run Workflow',
          function (done) {
            this.timeout(0);

            var update = {
              propertyBag: {
                isPaused: true
              }
            };

            if (!resourceId) return done();
            shippable.putResourceById(resourceId, update,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: putResourceById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('unPause Run Workflow',
          function (done) {
            this.timeout(0);

            var update = {
              propertyBag: {
                isPaused: false
              }
            };

            if (!resourceId) return done();

            shippable.putResourceById(resourceId, update,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: putResourceById failed with error: %s',
                      testSuiteDesc, err);
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

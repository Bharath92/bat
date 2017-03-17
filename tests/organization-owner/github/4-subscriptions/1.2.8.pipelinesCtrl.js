'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Pipelines Controller';
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
var resourcesVm = [];
var resourcesById = {};

describe(testSuite,
  function () {

    describe('Resource Modal Controller',
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
                    assert.notEqual(subscriptions.length, 0);
                  } else
                    subscriptionId = _.first(subscriptions).id;

                  return done();
                }
              }
            );
          }
        );

        it('Get Subscription By Id',
          function (done) {
            this.timeout(0);

            if (!subscriptionId) return done();

            shippable.getSubscriptionById(subscriptionId,
              function(err, subscription) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getSubscriptionById, failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  if (subscription.status<200 || subscription.status>=299)
                    logger.warn("status is::",subscription.status);
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
                    assert.notEqual(resources.length, 0);
                  }
                  jobsVm = _.where(resources, {"isJob": true});
                  resourcesVm = _.where(resources, {"isJob": false});
                  resourcesById = _.indexBy(resources, 'id');
                  return done();
                }
              }
            );
          }
        );

        it('get Job Dependencies',
          function (done) {
            this.timeout(0);

            var query = util.format('subscriptionIds=%s', subscriptionId);
            shippable.getJobDependencies(query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getJobDependencies failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Successfully Got dependencies');
                  return done();
                }
              }
            );
          }
        );

        it('get Build Status By SubscriptionId',
          function (done) {
            this.timeout(0);

            if (!subscriptionId) return done();

            var query = util.format('subscriptionIds=%s', subscriptionId);
            shippable.getBuildStatusBySubscriptionId(subscriptionId, query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getBuildStatusBySubscriptionId' +
                      'failed with error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Successfully Got builds');
                  return done();
                }
              }
            );
          }
        );

        it('get Version By Id',
          function (done) {
            this.timeout(0);

            if(_.isEmpty(resourcesVm)) return done();
            var versionId = _.first(resourcesVm).lastVersionId;
            shippable.getVersionById(versionId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getVersionById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get Resource By Id',
          function (done) {
            this.timeout(0);

            if(_.isEmpty(resourcesVm)) return done();
            var resourceId = _.first(resourcesVm).id;
            shippable.getResourceById(resourceId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getResourceById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get resources',
          function (done) {
            this.timeout(0);

            var query = util.format('isDeleted=true&subscriptionIds=%s',
              subscriptionId);
            shippable.getResources(query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get resources failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get versions for each resource',
          function (done) {
            this.timeout(0);

            if (_.isEmpty(resourcesVm)) return done();
            async.each(resourcesVm,
              function (resource, nextResource) {
                var query = util.format('resourceIds=%s&sortBy=id&limit=1',
                  resource.id);
                shippable.getVersions(query,
                  function(err) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: getVersions failed with error: %s',
                          testSuite, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                    }
                    return nextResource();
                  }
                );
              },
              function (err) {
                return done();
              }
            );

          }
        );

        it('Get Projects',
          function (done) {
            this.timeout(0);

            var query = util.format('subscriptionIds=%s',subscriptionId);
            shippable.getProjects(query,
              function (err, projs) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                if (_.isEmpty(projs)) {
                  logger.warn('No projects found');
                  assert.notEqual(projs.length, 0);
                }
                return done();
              }
            );
          }
        );

        it('Get Inflight Builds',
          function (done) {
            this.timeout(0);

            var query = 'statusCodes=4001';
            shippable.getBuilds(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get builds failed with error: %s',
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

'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add a Resource';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var githubAccntIntId = '';
var githubSubIntId = '';
var shippable = '';
var gitHubAccntInt = {};
var subscriptionId = '';
var projectId = '';
var projectName = '';
var syncRepoResourceId = '';
var rSyncResourceId = '';
var resourceName = '';

describe(testSuite,
  function () {

    describe('Create Github subscriptionIntegration',
      function () {

        it('Organization-Owner-github-getSubscription',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var query = util.format('orgNames=%s',nconf.get("GITHUB_ORG_1"));
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

        it('Get github AccountIntegartion',
          function (done) {
            this.timeout(0);
            shippable = new Shippable(config.apiToken);

            var query = util.format('names=%s', 'github');
            shippable.getAccountIntegrations('',
              function(err, accInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get AccountIntegartion failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  gitHubAccntInt = _.first(accInts);
                  githubAccntIntId = gitHubAccntInt.id;
                  return done();
                }
              }
            );
          }
        );

        it('Add github subscriptionIntegration',
          function (done) {
            this.timeout(0);

            var body = {
              "accountIntegrationId": gitHubAccntInt.id,
              "subscriptionId": subscriptionId,
              "name": gitHubAccntInt.name,
              "propertyBag": {
                "enabledByUserName": nconf.get("GITHUB_ORG_1"),
                "accountIntegrationName": gitHubAccntInt.name
              }
            };

            shippable.postSubscriptionIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add sub-integration:%s failed with error: %s',
                      testSuiteDesc, gitHubAccntInt.name, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added subscription integration');
                  githubSubIntId = res.id;
                  return done();
                }
              }
            );
          }
        );

      }
    );

    describe('Create New Resource',
      function () {

        it('Get Projects',
          function (done) {
            this.timeout(0);

            var query = util.format('subscriptionIds=%s',subscriptionId);
            shippable.getProjects(query,
              function (err, projects) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s' +
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  var project = {};
                  project = _.findWhere(projects, {isPrivateRepository: false});
                  projectId = project.id;
                  projectName = project.name;
                  return done();
                }
              }
            );
          }
        );

        it('Add a resource',
          function (done) {
            this.timeout(0);

            resourceName = projectName + '_master';
            var data = {
              "resourceName": resourceName,
              "projectId": projectId,
              "subscriptionId": subscriptionId,
              "branch": 'master',
              "subscriptionIntegrationId": githubSubIntId
            };

            shippable.postNewSyncRepo(data,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add resource failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added resource');
                  setTimeout(done,120000);
                }
              }
            );
          }
        );

      }
    );

    describe('Delete Resource',
      function () {

        it('get resources',
          function (done) {
            this.timeout(0);

            var query = util.format('subscriptionIds=%s',subscriptionId);
            shippable.getResources(query,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get resource failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  syncRepoResourceId = _.findWhere(res, {"typeCode":1014}).id;
                  rSyncResourceId = _.findWhere(res, {"typeCode":2009}).id;
                  return done();
                }
              }
            );
          }
        );

        it('Get Builds',
          function (done) {
            this.timeout(0);
            var bag = {
              resourceId : rSyncResourceId,
              isStatusCompleted: false
            };

            bag.timeoutLength = 1;
            bag.timeoutLimit = 180;

            _getBuildByResourceId(bag, done);
          }
        );

        it('soft delete resource',
          function (done) {
            this.timeout(0);

            var query = '';
            shippable.deleteResourceById(syncRepoResourceId, query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: deleteResourceById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug("Soft Deleted Resource");
                  return done();
                }
              }
            );
          }
        );

        it('hard delete resource',
          function (done) {
            this.timeout(0);

            var query = 'hard=true';
            shippable.deleteResourceById(syncRepoResourceId, query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: deleteResourceById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug("Hard Deleted Resource");
                  return done();
                }
              }
            );
          }
        );

      }
    );

  }
);

function _getBuildByResourceId (bag, done) {
  var query = util.format('resourceIds=%s',bag.resourceId);

  shippable.getBuilds(query,
    function(err, builds) {
      if (err) {
        isTestFailed = true;
        var testCase =
          util.format(
            '\n- [ ] %s: Get builds, failed with error: %s',
            testSuiteDesc, err);
        bag.isStatusCompleted = true;
        testCaseErrors.push(testCase);
        assert.equal(err, null);
        return done();
      } else {
        if (!_.isEmpty(builds)) {
          var build = _.first(builds);
          if (build.statusCode === 4002 || build.statusCode === 4003 )
            bag.isStatusCompleted = true;
        }

        if (!bag.isStatusCompleted) {
          bag.timeoutLength *= 2;
          if (bag.timeoutLength > bag.timeoutLimit)
            bag.timeoutLength = 1;

          setTimeout(function () {
            _getBuildByResourceId(bag, done);
          }, bag.timeoutLength * 1000);
        }
        return done();
      }
    }
  );
}

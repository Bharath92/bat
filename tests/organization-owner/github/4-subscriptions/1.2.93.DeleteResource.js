'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Delete Resource';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var subscriptionId = '';
var subIntId = '';
var rSyncResourceId = '';
var syncRepoResourceId = '';

describe(testSuite,
  function () {

    describe('Delete Resource',
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
                  rSyncResourceId = _.first(_.where(resources, {"isJob": true})).id;
                  syncRepoResourceId = _.first(_.where(resources, {"isJob": false})).id;
                  subIntId = _.first(resources).subscriptionIntegrationId;
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

        it('delete Github subscriptionIntegration',
          function (done) {
            this.timeout(0);

            shippable.deleteSubscriptionIntegrationById(subIntId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: deleteSubscriptionIntegrationById failed ' +
                      'with error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug("Deleted github SubscriptionIntegration");
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
        if (bag.isStatusCompleted)
          return done();
      }
    }
  );
}

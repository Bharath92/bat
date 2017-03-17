'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Job Trace ';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var resource = {};
var subscriptionId = '';

describe(testSuite,
  function () {

    describe('Job Trace Controller',
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

        it('Get resources',
          function (done) {
            this.timeout(0);

            if (!subscriptionId) return done();

            var bag = {
              subscriptionId : subscriptionId,
              isStatusCompleted: false
            };

            bag.timeoutLength = 1;
            bag.timeoutLimit = 180;

            _getResources(bag, done);
          }
        );

        it('get versions',
          function (done) {
            this.timeout(0);
            var query = util.format('versionIds=%s',
              resource.lastVersionId);
            shippable.getVersions(query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: get Versions failed with error: %s',
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

            var query = util.format('subscriptionIds=%s&names=%s',
              subscriptionId, resource.name);
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

function _getResources(bag, done) {
  var query = util.format('isDeleted=false&subscriptionIds=%s',
    bag.subscriptionId);

  shippable.getResources(query,
    function(err, resources) {
      if (err) {
        isTestFailed = true;
        var testCase =
          util.format(
            '\n- [ ] %s: Get resources failed with error: %s',
            testSuiteDesc, err);
        bag.isStatusCompleted = true;
        testCaseErrors.push(testCase);
        assert.equal(err, null);
        return done();
      } else {
        if (_.isEmpty(resources)){
          logger.warn('getResources returned 0 resources');
          assert.equal(resources, 1);
        }
        resource = _.first(_.where(resources, {"isJob": true}));

        if (resource.lastVersionId)
          bag.isStatusCompleted = true;

        if (!bag.isStatusCompleted) {
          bag.timeoutLength *= 2;
          if (bag.timeoutLength > bag.timeoutLimit)
            bag.timeoutLength = 1;

          setTimeout(function () {
            _getResources(bag, done);
          }, bag.timeoutLength * 1000);
        }

        if (bag.isStatusCompleted)
          return done();
      }
    }
  );
}

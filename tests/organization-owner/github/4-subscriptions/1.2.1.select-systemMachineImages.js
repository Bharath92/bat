'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Machine Images';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var machineImageIds = [];
var subscriptionId = '';

describe(testSuite,
  function () {

    describe('select Machine Images',
      function () {
        it('Get systemMachineImages',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var query = 'isAvailable=true';
            shippable.getMachineImages(query,
              function(err, machineImages) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get systemMachineImages failed with ' +
                      'error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(machineImages,
                    function (machineImage) {
                      machineImageIds.push(machineImage.id);
                    }
                  );
                  return done();
                }
              }
            );
          }
        );

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
                      testSuiteDesc, name, err);
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

        it('put systemMachineImageId to subscriptions',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(machineImageIds,
              function (machineImageId, nextMachineImageId) {
                shippable.putSubscriptionById(subscriptionId,
                  { systemMachineImageId : machineImageId },
                  function(err) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: put subscriptionById failed with ' +
                          'error: %s',
                          testSuite, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextMachineImageId();
                    } else {
                      return nextMachineImageId();
                    }
                  }
                );
              },
              function (err) {
                logger.debug('Done');
                return done();
              }
            );
          }
        );

      }
    );

    describe('Create GitHub issue if failed',
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

'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Nodes';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var subscriptionId = '';
var isCustomNode = false;
var isDynamicNode = false;
var jobIds = [];
var hostChangeAllowed;

describe(testSuite,
  function () {

    describe('Nodes Controller',
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

        it('get Subscription State By Id',
          function (done) {
            this.timeout(0);

            shippable.getSubscriptionStateById(subscriptionId,
              function(err, subscriptionState) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getSubscriptionState failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  isCustomNode = (subscriptionState.nodeTypeCode === 7000);
                  isDynamicNode = (subscriptionState.nodeTypeCode === 7001);
                  hostChangeAllowed = subscriptionState.hostChangeAllowed;
                  return done();
                }
              }
            );
          }
        );

        it('get ClusterNodes',
          function (done) {
            this.timeout(0);

            if (isCustomNode) return done();

            var query = util.format('subscriptionIds=%s&nodeTypeCode=7002',
              subscriptionId);

            shippable.getClusterNodes(query,
              function(err, clusterNodes) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getClusterNodes failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  jobIds = _.pluck(clusterNodes, 'jobId');
                  jobIds = _.filter(jobIds,
                    function (id) {
                      return !_.isEmpty(id);
                    }
                  );
                  return done();
                }
              }
            );
          }
        );

        it('get Jobs',
          function (done) {
            this.timeout(0);

            if (_.isEmpty(jobIds)) return done();

            var query = util.format('jobIds=%s', jobIds.join(','));

            shippable.getJobs(query,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getJobs failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('get BuildJobs',
          function (done) {
            this.timeout(0);

            if (_.isEmpty(jobIds)) return done();

            var query = util.format('jobIds==%s', jobIds.join(','));

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

        it('Change to Custom Node',
          function (done) {
            this.timeout(0);
            if (!hostChangeAllowed) return done();

            var update = {};

            if (isCustomNode)
              update.nodeTypeCode = 7001;
            else if (isDynamicNode)
              update.nodeTypeCode = 7000;

            shippable.putSubscriptionById(subscriptionId, update,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: putSubscriptionById failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                }
                if (update.nodeTypeCode === 7001) {
                  isCustomNode = false;
                  isDynamicNode = true;
                } else if (update.nodeTypeCode === 7000) {
                  isCustomNode = true;
                  isDynamicNode = false;
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

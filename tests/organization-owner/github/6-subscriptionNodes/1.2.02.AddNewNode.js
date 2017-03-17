'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add New Nodes';
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
var hostChangeAllowed;
var clusterNodeId = '';

describe(testSuite,
  function () {

    describe('Add New Nodes Controller',
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

        it('get Subscription State By Id',
          function (done) {
            this.timeout(0);

            if (!subscriptionId) return done();

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

        it('Add a custom node',
          function (done) {
            this.timeout(0);

            if (isDynamicNode) return done();
            if (!subscriptionId) return done();

            var newNode = {
              subscriptionId: subscriptionId,
              friendlyName: 'test-owner-node',
              location: '52.53.233.36',
              nodeInitScript: '{"script":null,"name":"ubu_16.04_docker_1.13.sh"}',
              nodeType: 'slave',
              status: 'ready',
              initializeSwap: false,
              nodeTypeCode: 7000,
              sshPort: 22,
              isShippableInitialized: true
            };
            shippable.postToClusterNode(newNode,
              function(err, node) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: postToClusterNode failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  clusterNodeId = node.id;
                  return done();
                }
              }
            );
          }
        );

        it('get ClusterNode ById',
          function (done) {
            this.timeout(0);

            if (isDynamicNode) return done();
            if (!clusterNodeId) return don();

            shippable.getClusterNodeById(clusterNodeId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: getClusterNodeById failed with error: %s',
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

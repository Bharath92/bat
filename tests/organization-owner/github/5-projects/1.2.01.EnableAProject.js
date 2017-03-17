'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Enable Project';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';
var projectId = '';

describe('Enable Project',
  function() {

    describe(testSuite,
      function () {

        it('Organization-Owner-github-getSubscription',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
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

                  if (_.isEmpty(subscriptions))
                    logger.warn('No subscriptions found, skipping subsequent ' +
                      'testcases');
                  else
                    subscriptionId = _.first(subscriptions).id;

                  nconf.set('shiptest-GITHUB_ORG_1:subscriptionId', subscriptionId);
                  nconf.save(function (err) {
                    if (err)
                      logger.debug("Failed");
                    return done();
                  });
                }
              }
            );
          }
        );

        it('Get Projects',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var query = util.format('subscriptionIds=%s',subscriptionId);
            shippable.getProjects(query,
              function (err, projects) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get projects failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  var project = {};
                  project = _.findWhere(projects, {isPrivateRepository: false});
                  projectId = project.id;
                  nconf.set('shiptest-GITHUB_ORG_1:projectId',projectId);
                  nconf.save(function (err) {
                    if (err)
                      logger.debug("Failed");
                    return done();
                  });
                }
              }
            );
          }
        );

        it('Enable Project',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            if (!projectId) return done();

            var body = {
              projectId: projectId,
              type: 'ci'
            };
            shippable.enableProjectById(projectId, body,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Enable project id: %s failed with error: %s' +
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug("Enabled");
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

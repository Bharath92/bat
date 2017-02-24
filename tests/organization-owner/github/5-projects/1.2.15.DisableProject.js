'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Disable Project';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var subscriptionId = '';

describe('Disable Project',
  function() {

    describe(testSuite,
      function () {


        it('Disable Project',
          function (done) {
            this.timeout(0);
            var pathToJson = process.cwd() + '/config.json';
            nconf.argv().env().file({file: pathToJson});
            nconf.load();
            var projectId = nconf.get("shiptest-GITHUB_ORG_1:projectId");
            var shippable = new Shippable(config.apiToken);
            var body = {
              projectId: projectId
            };

            shippable.deleteProjectById(projectId, body,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Disable project id: %s failed with error: %s' +
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug("Disabled");
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

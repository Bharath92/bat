'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Params Modal';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var shippable = '';
var resource = {};

describe(testSuite,
  function () {

    describe('Resource Modal Controller',
      function () {
        it('get syncRepo resource',
          function (done) {
            this.timeout(0);

            shippable = new Shippable(config.apiToken);
            var query = 'typeCodes=1014';
            shippable.getResources(query,
              function(err,res) {
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
                  if (_.isEmpty(res)){
                    logger.warn('syncRepo resource is not present');
                    assert.equal(res, 1);
                  }
                  resource = _.first(res);
                  return done();
                }
              }
            );
          }
        );

        it('Get Versions By ResourceId',
          function (done) {
            this.timeout(0);

            if (!resource) return done();
            var query = util.format(
              'resourceIds=%s&subscriptionIds=%s&sortBy=id&limit=1', resource.id,
              resource.subscriptionId);

            shippable.getVersions(query,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s get Versions failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                }
                return done();
              }
            );
          }
        );

        it('post Version',
          function (done) {
            this.timeout(0);

            if (!resource) return done();

            var newVersion = {
              resourceId: resource.id,
              projectId: resource.projectId,
              versionTrigger: true,
              propertyBag: {}
            };

            shippable.postVersion(newVersion,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s postVersion failed with error: %s',
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

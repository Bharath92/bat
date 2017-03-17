'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'ApiTokens';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2.API Tokens - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];

describe(testSuite,
  function () {

    var apiTokenIds = [];
    describe('Getting list of ApiTokens',
      function () {
        it('Get List of API Tokens',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getAccountTokens('',
              function(err, apiTokens) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get List of API Tokens failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(apiTokens,
                    function (apiToken) {
                      apiTokenIds.push(apiToken.id);
                    }
                  );
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('delete ApiTokens',
      function () {
        it('delete ApiTokens',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            if (_.isEmpty(apiTokenIds)) return done();

            async.each(apiTokenIds,
              function(tokenId, nextTokenId) {
                shippable.deleteAccountToken(tokenId,
                  function(err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: delete ApiTokens failed with error: %s',
                          testSuite, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextTokenId();
                    } else {
                      return nextTokenId();
                    }
                  }
                );
              },
              function (err) {
                if (err)
                  logger.debug("Failed");
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
              var body =
                util.format('Failed test cases are:\n%s',testCaseErrors);
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

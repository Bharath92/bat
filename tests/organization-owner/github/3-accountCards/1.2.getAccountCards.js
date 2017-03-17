'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Account Cards';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var accountCardIds = [];

describe(testSuite,
  function () {

    describe('Getting list of AccountCards',
      function () {
        it('Get List of AccountCards',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getAccountCards('',
              function(err, acctCards) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get List of AccountCards failed with ' +
                      'error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(acctCards,
                    function (acctCard) {
                      accountCardIds.push(acctCard.id);
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

    describe('delete AccountCards',
      function () {
        it('delete AccountCards',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            if (_.isEmpty(accountCardIds)) return done();

            async.each(accountCardIds,
              function(accountCardId, nextAccountCardId) {
                shippable.deleteAccountCardById(accountCardId,
                  function(err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: delete AccountCard for id: ' +
                          '%s failed with error: %s',
                          testSuite, accountCardId, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextAccountCardId();
                    } else {
                      return nextAccountCardId();
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

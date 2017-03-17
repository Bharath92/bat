var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add Tokens in account settings page';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2.accounts_AddToken - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var ownerAccountId = nconf.get("shiptest-github-owner:accountId");

describe('Add Tokens with different name',
  function () {

    describe(testSuite,
      function () {
        it('Enter token name with 150 characters',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "Q6sW4LKREx20/Zw0g5Mpr6gJeZWzIsu2f6t3jJ4/sDGVu7PMWqFD" +
                         "v4KAGF97Tc9BE/5/LJ+D5SVSdHdY2oe7cwQrblqWA79riC8yS1c" +
                         "6Le27bGMjoqBSs7Opdd99C+SwdS1G1KDzq39eKXhXyoIM7q";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Fails to add token with token' +
                                ' name with 150 characters: %s', testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token with token name with 150 characters');
                  return done();
                }
              }
            );
          }
        );

        it('Enter token name with less than 150 characters',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "Q6sW4LKREx20/Zw0g5Mpr6gJeZWzIsu2f6t3jJ4/sDGVu7PMWqFDv" +
                         "4KAGF97Tc9BE/5/LJ+D5SVSdHdY2oe7cwQrblqWA79riC8yS1c6" +
                         "Le27bGMjoqBSs7Opdd99C+SwdS1G1KDzq39eKX";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Fails to add token name with less' +
                                'than 150 characters %s',testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token with name less than 150 characters');
                  return done();
                }
              }
            );
          }
        );

        it('Enter a - z; A - Z;',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "abcABC";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Fails to add token with token' +
                      'name with a - z; A - Z;: %s', testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token with token name with a - z; A - Z;');
                  return done();
                }
              }
            );
          }
        );

        it('Enter numbers',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "1234567890";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Fails to add token name with numbers: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token with token name with numbers');
                  return done();
                }
              }
            );
          }
        );

        it('Enter special characters',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "!@#$%^&()";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Fails to add token name with special characters: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token name with special characters');
                  return done();
                }
              }
            );
          }
        );

        it('Enter Alphanumeric values',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "12345678qwertyuio";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Fails to add token name with' +
                      'Alphanumeric values: %s', testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug(
                    'Adds token with token name with Alphanumeric values');
                  return done();
                }
              }
            );
          }
        );

        it('Enter the name with blank spaces',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "  aa    bb  ccc";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Fails to add token name with blank spaces: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Adds token with token name with blank spaces');
                  return done();
                }
              }
            );
          }
        );

        it('Enter special characters,numbers,alphabets',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "@#test&*(123";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Fails to add token name with' +
                      'special characters,numbers,alphabets: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug(
                    'Adds token name with special characters,numbers,alphabets');
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe(testSuite,
      function () {
        it('Enter token name with more than 150 characters',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "Q6sW4LKREx20/Zw0g5Mpr6gJeZWzIsu2f6t3jJ4/sDGVu7PMWqFD" +
                       "v4KAGF97Tc9BE/5/LJ+D5SVSdHdY2oe7cwQrblqWA79riC8yS1c6L" +
                       "e27bGMjoqBSs7Opdd99C+SwdS1G1KDzq39eKXhXyoIM7q123456";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  logger.debug(
                    'Fails to add token name with more than 150 characters');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Adds token with token name '+
                      'with more than 150 characters: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
                }
              }
            );
          }
        );
        it('Enter the name already exists',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            if (!ownerAccountId) return done();

            var name = "abcABC";
            shippable.postAccountTokens(name, ownerAccountId,
              function(err) {
                if (err) {
                  logger.debug(
                    'Fails to add token with token name already exists');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Adds token with token name already exists: %s',
                      testSuite, name);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
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

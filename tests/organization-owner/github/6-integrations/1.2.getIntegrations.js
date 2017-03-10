'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Get Integrations';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
                  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var accountIntegrationIds = [];
var subIntegrationIds = [];
var accountIntegrations = [];
var subscriptionIntegrations = [];

describe(testSuite,
  function () {

    describe('Getting list of AccountIntegartions',
      function () {
        it('Get List of AccountIntegartions',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getAccountIntegrations('',
              function(err, accInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get AccountIntegartions failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(accInts,
                    function (accInt) {
                      accountIntegrationIds.push(accInt.id);
                    }
                  );
                  accountIntegrations = accInts;
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('Edit account Integrations',
      function () {
        it('Edit Gitlab Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations, {name:"OrgOwner-gitlab"});
            __setFormJSONValue(body.formJSONValues, 'password', 'token');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit Gitlab AccountIntgeration failed with' +
                      'error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit AWS Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations, {name:"OrgOwner-aws"});
            __setFormJSONValue(body.formJSONValues, 'aws_access_key_id', 'key');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit AWS AccountIntgeration failed with' +
                      'error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Amazon ECR Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations, {name:"OrgOwner-ecr"});
            __setFormJSONValue(body.formJSONValues, 'aws_access_key_id', 'key');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit ECR AccountIntgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit ACS Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations, {name:"OrgOwner-acs"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit ACS Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit bitbucket Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-bitbucket"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit bitbucket Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit ddc Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-ddc"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit ddc Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit docker Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-docker"});
            __setFormJSONValue(body.formJSONValues, 'email', 'test@gmail.com');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit docker Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit event trigger Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-event-trigger"});
            __setFormJSONValue(body.formJSONValues, 'webhookURL', 'test');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit event trigger Intgeration failed with'+
                      'error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit gcr Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-gcr"});
            __setFormJSONValue(body.formJSONValues, 'JSON_key', 'test');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit gcr Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit gke Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-gke"});
            __setFormJSONValue(body.formJSONValues, 'JSON_key', 'test');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit gke Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit hipchat Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-hipchat"});
            __setFormJSONValue(body.formJSONValues, 'token', 'test');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit hipchat Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit private docker registry Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-private-docker-registry"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit private docker registry Intgeration ' +
                      'failed with error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit generic webhook event trigger Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-generic-webhook"});
            __setFormJSONValue(body.formJSONValues, 'webhookURL', 'testing');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Edit generic webhook Intgeration' +
                      'failed with error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit slack Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-slack"});
            __setFormJSONValue(body.formJSONValues, 'webhookURL', 'test');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit slack Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit AWS_IAM Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-AWS_IAM"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit AWS_IAM Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Docker_Cloud Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-Docker_Cloud"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit dcl Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Docker_trusted_registry Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-Docker_trusted_registry"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Edit Docker_trusted_registry ' +
                      'Intgeration failed with error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Github-Enterprise Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-Github-Enterprise"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit Ghe Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Joyent-Triton-Public-Cloud Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-Joyent-Triton-Public-Cloud"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Edit Joyent-Triton-Public-Cloud '+
                      'Intgeration failed with error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit PEM-Key Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-PEM-Key"});
            __setFormJSONValue(body.formJSONValues, 'key', 'testing');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit PEM-Key Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit Quay.io Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-Quay.io"});
            __setFormJSONValue(body.formJSONValues, 'url', 'https://example1.com/');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit Quay.io Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

        it('Edit SSH-Key Account Intgeration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            var body = _.findWhere(accountIntegrations,
                         {name:"OrgOwner-SSH-Key"});
            __setFormJSONValue(body.formJSONValues, 'publicKey', 'testing');

            body.isValid = true;

            shippable.putAccountIntegration(body.id, body,
              function(err, res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Edit SSH-Key Intgeration failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Edited Integration');
                  return done();
                }
              }
            );
          }
        );

      }
    );

    describe('Getting the list of subscriptionIntegrations',
      function () {
        it('Get the list of subscriptionIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getSubscriptionIntegrations('',
              function (err, subInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get SubIntegrations failed with error: %s',
                      testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  _.each(subInts,
                    function (subInt) {
                      subIntegrationIds.push(subInt.id);
                    }
                  );
                  subscriptionIntegrations = subInts;
                  return done();
                }
              }
            );
          }
        );
      }
    );

    describe('Edit subscription Integration',
      function () {

        it('Edit all subscription Intgerations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(subscriptionIntegrations,
              function (subInt, nextSubInt) {
                subInt.name = subInt.name + 'edited';
                shippable.putSubscriptionIntegration(subInt.id, subInt,
                  function(err, res) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: Edit subIntgeration failed with error: %s',
                          testSuite, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextSubInt();
                    } else {
                      logger.debug('Edited Integration');
                      return nextSubInt();
                    }
                  }
                );
              },
              function (err) {
                return done();
              }
            );
          }
        );

      }
    );

    describe('delete AccountIntegrations With Dependencies',
      function () {
        it('delete AccountIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(accountIntegrationIds,
              function(accIntId, nextAccIntId) {
                shippable.deleteAccountIntegrationById(accIntId,
                  function(err) {
                    if (err) {
                      return nextAccIntId();
                    } else {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete AccountIntegrations With '+
                          'Dependencies failed', testSuite, accIntId);
                      testCaseErrors.push(testCase);
                      assert.notEqual(err, null);
                      return nextAccIntId();
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

    describe('Delete subscriptionIntegrations',
      function () {
        it('Delete SubscriptionIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(subIntegrationIds,
              function (subIntId, nextSubIntId) {
                shippable.deleteSubscriptionIntegrationById(subIntId,
                  function (err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete SubscriptionIntegration' +
                          ' for id: %s failed with error: %s',
                          testSuite, accIntId, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextSubIntId();
                    } else {
                      return nextSubIntId();
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

    describe('delete AccountIntegrations',
      function () {
        it('delete AccountIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            async.each(accountIntegrationIds,
              function(accIntId, nextAccIntId) {
                shippable.deleteAccountIntegrationById(accIntId,
                  function(err) {
                    if (err && err.status !== 404) {
                      isTestFailed = true;
                      var testCase =
                        util.format('\n- [ ] %s: delete AccountIntegration' +
                          ' for id: %s failed with error: %s',
                          testSuite, accIntId, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextAccIntId();
                    } else {
                      return nextAccIntId();
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

function __setFormJSONValue(formJSONArray, label, value) {
  var formJSONObj = _.findWhere(formJSONArray,
    { label : label });
  if (!formJSONObj)
    formJSONArray.push({
      label : label,
      value : value
    });
  else
    formJSONObj.value = value;
}

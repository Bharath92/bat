var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Add Integrations';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];

var accountIntegrations = [];
var subscriptionId = '';
describe('Add Integrations',
  function () {

    describe('Get github Account Integration',
      function () {

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

        it('Get github AccountIntegartion',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);

            shippable.getAccountIntegrations('',
              function(err, accInts) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Get github AccountIntegartion failed with' +
                      'error: %s', testSuite, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  accountIntegrations.push(_.first(accInts));
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

        it('Add Gitlab AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-gitlab";
            var token = nconf.get("GITLAB_ACCESS_TOKEN");
            var url = "https://gitlab.com/api/v3";
            var body = {
              "masterDisplayName": "GitLab Credentials",
              "masterIntegrationId": "574ee696d49b091400b71112",
              "masterName": "gitlabCreds",
              "masterType": "generic",
              "name": name,
              "formJSONValues": [
                {
                  "label": "password",
                  "value": token
                },
                {
                  "label": "url",
                  "value": url
                },
                {
                  "label": "username",
                  "value": name
                },
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add gitlab integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Amazon ECR AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-ecr";
            var body = {
              "masterDisplayName": "Amazon ECR",
              "masterIntegrationId": "5673c6561895ca4474669507",
              "masterName": "ECR",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "aws_access_key_id",
                  "value": "access_key"
                },
                {
                  "label": "aws_secret_access_key",
                  "value": "secret_key"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add ECR integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add AWS AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-aws";
            var body = {
              "masterDisplayName": "AWS",
              "masterIntegrationId": "55c8d2333399590c007982f8",
              "masterName": "AWS",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "aws_access_key_id",
                  "value": "1234567890"
                },
                {
                  "label": "aws_secret_access_key",
                  "value": "1234567890"
                },
                {
                  "label": "url",
                  "value": "https://api.aws.com"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add AWS integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add ACS AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-acs";
            var body = {
              "masterDisplayName": "Azure Container Service",
              "masterIntegrationId": "5723561699ddf70c00be27ed",
              "masterName": "ACS",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "url",
                  "value": "https://example.com/"
                },
                {
                  "label": "username",
                  "value": "name"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add ACS integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add bitbucket AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-bitbucket";
            var body = {
              "masterDisplayName": "BitBucket",
              "masterIntegrationId": "562dc347b84b390c0083e72e",
              "masterName": "bitbucket",
              "masterType": "scm",
              "name": name,
              "formJSONValues": [
                {
                  "label": "token",
                  "value": "token"
                },
                {
                  "label": "url",
                  "value": "https://bitbucket.org"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add bitbucket integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add ddc AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-ddc";
            var body = {
              "masterDisplayName": "Docker DataCenter",
              "masterIntegrationId": "571f081b37803a0d00455d25",
              "masterName": "DDC",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "password",
                  "value": "password"
                },
                {
                  "label": "url",
                  "value": "https://example.com/"
                },
                {
                  "label": "username",
                  "value": "name"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add ddc integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add docker AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-docker";
            var body = {
              "masterDisplayName": "Docker",
              "masterIntegrationId": "5553a7ac3566980c00a3bf0e",
              "masterName": "Docker",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "email",
                  "value": "test@gmail.com"
                },
                {
                  "label": "password",
                  "value": "password"
                },
                {
                  "label": "username",
                  "value": "name"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add docker integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add event trigger AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-event-trigger";
            var body = {
              "masterDisplayName": "Event Trigger",
              "masterIntegrationId": "573aab7c5419f10f00bef322",
              "masterName": "webhook",
              "masterType": "notification",
              "name": name,
              "formJSONValues": [
                {
                  "label": "authorization",
                  "value": "apiToken token"
                },
                {
                  "label": "project",
                  "value": null
                },
                {
                  "label": "projectId",
                  "value": "58073d98b2a4451100f16589"
                },
                {
                  "label": "resourceId",
                  "value": 12
                },
                {
                  "label": "resourceName",
                  "value": "dv-img"
                },
                {
                  "label": "webhookURL",
                  "value": "https://example.com/"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add event trigger integration failed with' +
                      'error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add gcr AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-gcr";
            var body = {
              "masterDisplayName": "GCR",
              "masterIntegrationId": "5553a8333566980c00a3bf1b",
              "masterName": "GCR",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "JSON_key",
                  "value": "{\n  \" -----BEGIN PRIVATE KEY-----" +
                           "\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKg" +
                           "wggSkAghzefoFK/i/\\n-----END PRIVATE KEY-----\\n\",\n}"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add gcr integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add gke AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-gke";
            var body = {
              "masterDisplayName": "Google Container Engine",
              "masterIntegrationId": "56d417653270aa438861cf65",
              "masterName": "GKE",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "JSON_key",
                  "value": "{\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----" +
                             "+OmrwMUAJ+/XRjFZ+VmcUn8\\nJaT/xc1C5+3L/A9eTRjT" +
                             "6cLp9DohQJaKjllQ==\\n---END PRIVATE KEY---\\n\",\n}"
                },
                {
                  "label": "url",
                  "value": "https://example.com/"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add gke integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add hipchat AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-hipchat";
            var body = {
              "masterDisplayName": "HipChat",
              "masterIntegrationId": "56fb978f1cc7210f00bd5e72",
              "masterName": "hipchat",
              "masterType": "notification",
              "name": name,
              "formJSONValues": [
                {
                  "label": "token",
                  "value": "token"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add hipchat integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add private docker registry AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-private-docker-registry";
            var body = {
              "masterDisplayName": "Private Docker Registry",
              "masterIntegrationId": "559e8f3e90252e0c00672376",
              "masterName": "Private Docker Registry",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "email",
                  "value": "test@gmail.com"
                },
                {
                  "label": "password",
                  "value": "password"
                },
                {
                  "label": "url",
                  "value": "https://example.com/"
                },
                {
                  "label": "username",
                  "value": "name"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add private docker registry integration' +
                      'failed with error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add generic webhook AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-generic-webhook";
            var body = {
              "masterDisplayName": "Event Trigger",
              "masterIntegrationId": "573aab7c5419f10f00bef322",
              "masterName": "webhook",
              "masterType": "notification",
              "name": name,
              "formJSONValues": [
                {
                  "label": "authorization",
                  "value": "test"
                },
                {
                  "label": "project",
                  "value": null
                },
                {
                  "label": "projectId",
                  "value": null
                },
                {
                  "label": "resourceId",
                  "value": null
                },
                {
                  "label": "resourceName",
                  "value": null
                },
                {
                  "label": "webhookURL",
                  "value": "https://example.com/"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add generic webhook integration failed with' +
                      'error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Slack AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-slack";
            var WebhookUrl = "https://hooks.slack.com/services/url";
            var body = {
              "masterDisplayName": "Slack",
              "masterIntegrationId": "55bba7932c6c780b00e4426c",
              "masterName": "Slack",
              "masterType": "notification",
              "name": name,
              "formJSONValues": [
                {
                  "label": "webhookUrl",
                  "value": WebhookUrl
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add slack integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add AWS_IAM AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-AWS_IAM";
            var body = {
              "masterDisplayName": "Amazon Web Services (IAM)",
              "masterIntegrationId": "571032a897aadea0ee186900",
              "masterName": "AWS_IAM",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "assumeRoleARN",
                  "value": "test"
                },
                {
                  "label": "awsAccountId",
                  "value": "null"
                },
                {
                  "label": "externalId",
                  "value": "5822dfe0e154f00e006950c3"
                },
                {
                  "label": "output",
                  "value": "text"
                },
                {
                  "label": "url",
                  "value": "https://api.aws.com"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add AWS_IAM integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Docker Cloud AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-Docker_Cloud";
            var body = {
              "masterDisplayName": "Docker Cloud",
              "masterIntegrationId": "570651b5f028a50b008bd955",
              "masterName": "DCL",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "token",
                  "value": "qwertyuiop"
                },
                {
                  "label": "url",
                  "value": "https://cloud.docker.com"
                },
                {
                  "label": "username",
                  "value": "test"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add dcl integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Docker Trusted Registry AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-Docker_trusted_registry";
            var body = {
              "masterDisplayName": "Docker Trusted Registry",
              "masterIntegrationId": "57110b987ed9d269c9d71ac1",
              "masterName": "Docker Trusted Registry",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "email",
                  "value": "test"
                },
                {
                  "label": "password",
                  "value": "test"
                },
                {
                  "label": "url",
                  "value": "http://test"
                },
                {
                  "label": "username",
                  "value": "test"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add Docker Trusted Registry integration' +
                      'failed with error: %s',testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Github Enterprise AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-Github-Enterprise";
            var body = {
              "masterDisplayName": "Github Enterprise",
              "masterIntegrationId": "563347d6046d220c002a3474",
              "masterName": "ghe",
              "masterType": "scm",
              "name": name,
              "formJSONValues": [
                {
                  "label": "token",
                  "value": "test"
                },
                {
                  "label": "url",
                  "value": "https://example.com/"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add ghe integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Joyent Triton Public Cloud AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-Joyent-Triton-Public-Cloud";
            var body = {
              "masterDisplayName": "Joyent Triton Public Cloud",
              "masterIntegrationId": "576ce63321333398d11a35ab",
              "masterName": "TRIPUB",
              "masterType": "deploy",
              "name": name,
              "formJSONValues": [
                {
                  "label": "certificates",
                  "value": "{\"cert.pem\":\"-----BEGIN CERTIFICATE-----" +
                            "\nMIICmjYBKa+af78x9sg==\\n--END CERTIFICATE--\\n\"}"
                },
                {
                  "label": "privateKey",
                  "value": "-----BEGIN RSA PRIVATE KEY-----\nMIIEoA2eMB"+
                             "8IG8Y6HWRpi+kBK86jd\n--END RSA PRIVATE KEY--\n"
                },
                {
                  "label": "publicKey",
                  "value": "ssh-rsa AAAABCex1K9qQDbKIPFF0ZaxhRHWY8VDyqG71 \n"
                },
                {
                  "label": "url",
                  "value": "https://api.joyentcloud.com"
                },
                {
                  "label": "username",
                  "value": "test"
                },
                {
                  "label": "validityPeriod",
                  "value": "123"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add Joyent Triton Public Cloud integration' +
                      'failed with error: %s', testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add PEM Key AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-PEM-Key";
            var body = {
              "masterDisplayName": "PEM Key",
              "masterIntegrationId": "568aa74cd43b0d0c004fec91",
              "masterName": "pem-key",
              "masterType": "key",
              "name": name,
              "formJSONValues": [
                {
                  "label": "key",
                  "value": "test"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add PEM Key integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add Quay.io AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-Quay.io";
            var body = {
              "masterDisplayName": "Quay.io",
              "masterIntegrationId": "559eab320a31140d00a15d3a",
              "masterName": "Quay.io",
              "masterType": "hub",
              "name": name,
              "formJSONValues": [
                {
                  "label": "accessToken",
                  "value": "test"
                },
                {
                  "label": "email",
                  "value": "test"
                },
                {
                  "label": "password",
                  "value": "test"
                },
                {
                  "label": "url",
                  "value": "http://quay.io"
                },
                {
                  "label": "username",
                  "value": "test"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add Quay.io integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        it('Add SSH Key AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-SSH-Key";
            var body = {
              "masterDisplayName": "SSH Key",
              "masterIntegrationId": "568aa7c3368a090c006da702",
              "masterName": "ssh-key",
              "masterType": "key",
              "name": name,
              "formJSONValues": [
                {
                  "label": "privateKey",
                  "value": "test"
                },
                {
                  "label": "publicKey",
                  "value": "test"
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n- [ ] %s: Add SSH Key integration failed with error: %s',
                      testSuiteDesc, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Added integration');
                  accountIntegrations.push(res);
                  return done();
                }
              }
            );
          }
        );

        /*it('Add invalid Slack AccountIntegration',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            var name = "OrgOwner-slack-invalid-name-in-account-integration-that-is-with-more-than-eighty-characters";
            var WebhookUrl = "https://hooks.slack.com/services/url1";
            var body = {
              "masterDisplayName": "Slack",
              "masterIntegrationId": "55bba7932c6c780b00e4426c",
              "masterName": "Slack",
              "masterType": "notification",
              "name": name,
              "formJSONValues": [
                {
                  "label": "webhookUrl",
                  "value": WebhookUrl
                }
              ]
            };
            shippable.postAccountIntegration(body,
              function(err,res) {
                if (err) {
                  logger.debug('Cannot Add integration,test passed');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format('\n- [ ] %s: Added invalid slack integration: %s, testcase failed',
                      testSuiteDesc, name);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
                }
              }
            );
          }
        );*/

      }
    );

    describe(testSuite,
      function () {

        it('Add subscriptionIntegrations',
          function (done) {
            this.timeout(0);
            var shippable = new Shippable(config.apiToken);
            async.each(accountIntegrations,
              function (accInt, nextAccInt) {
                var body = {
                  "accountIntegrationId": accInt.id,
                  "subscriptionId": subscriptionId,
                  "name": accInt.name,
                  "propertyBag": {
                    "enabledByUserName": nconf.get("GITHUB_ORG_1"),
                    "accountIntegrationName": accInt.name
                  }
                };
                shippable.postSubscriptionIntegration(body,
                  function(err,res) {
                    if (err) {
                      isTestFailed = true;
                      var testCase =
                        util.format(
                          '\n- [ ] %s: Add sub-integration:%s failed with error: %s',
                          testSuiteDesc, accInt.name, err);
                      testCaseErrors.push(testCase);
                      assert.equal(err, null);
                      return nextAccInt();
                    } else {
                      logger.debug('Added subscription integration');
                      return nextAccInt();
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

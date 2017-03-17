'use strict';

var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var _ = require('underscore');
var assert = chai.assert;
var testSuiteNum = '1.';
var testSuiteDesc = 'Project RunsConfig';
var adapter = require('../../../../_common/shippable/github/Adapter.js');
var Shippable = require('../../../../_common/shippable/Adapter.js');

var testSuite = util.format('%s2 - %s', testSuiteNum,
  testSuiteDesc);

var isTestFailed = false;
var testCaseErrors = [];
var projectId = '';
var branches = [];
var shippable = '';
var accountId = '';

describe('Project RunsConfig',
  function () {

    describe(testSuite,
      function () {

        it('Get ProjectOwnerAccounts',
          function (done) {
            this.timeout(0);
            projectId = nconf.get('shiptest-GITHUB_ORG_1:projectId');
            if (!projectId) return done();

            shippable = new Shippable(config.apiToken);
            shippable.getProjectOwnerAccounts(projectId,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Get ProjectOwnerAccounts for ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Set OwnerAccountIdWorkflow',
          function (done) {
            this.timeout(0);
            accountId = nconf.get('shiptest-github-owner:accountId');

            if (!projectId) return done();
            if (!accountId) return done();

            var update = {
              ownerAccountId: accountId,
              builderAccountId: accountId
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SetOwnerAccountIdWorkflow for ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Automate Low Coverage Alert for value 10',
          function (done) {
            this.timeout(0);

            if (!projectId) return done();

            var update = {
              propertyBag: {
                lowCoverageLimit: 10,
                unstableOnLowCoverage: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Automate Low Coverage Alert for 10' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Automate Low Coverage Alert for value 50',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                lowCoverageLimit: 50,
                unstableOnLowCoverage: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Automate Low Coverage Alert for 50' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Automate Low Coverage Alert for value 99',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                lowCoverageLimit: 99,
                unstableOnLowCoverage: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Automate Low Coverage Alert for 99' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Automate Low Coverage Alert for value 40',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                lowCoverageLimit: 40,
                unstableOnLowCoverage: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Automate Low Coverage Alert for 40' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for valid value 10 mins (600000 ms)',
          function (done) {
            this.timeout(0);

            if (!projectId) return done();

            var update = {
              propertyBag: {
                timeoutMS: 600000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10 mins' +
                      '(600000 ms) projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for valid value 10.5 mins (630000 ms)',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                timeoutMS: 630000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10.5 mins' +
                      '(630000 ms) projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for invalid value 10000000 ms',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                timeoutMS: 10000000
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  logger.debug('Failed to update Custom Timeout with' +
                    ' 10000000 ms value');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 10000000 ms' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for invalid value ee',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                timeoutMS: 'ee'
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  logger.debug('Failed to update Custom Timeout with' +
                    ' ee value');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value ee ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
                }
              }
            );
          }
        );

        it('Custom Timeout for invalid value 0 ms',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                timeoutMS: 0
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  logger.debug('Failed to update Custom Timeout with' +
                    ' 0 ms value');
                  return done();
                } else {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Custom Timeout for valid value 0 ms' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.notEqual(err, null);
                  return done();
                }
              }
            );
          }
        );

        it('Disable Run Parallel Jobs',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serialize: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Run Parallel Jobs Disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable Run Parallel Jobs',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serialize: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Run Parallel Jobs Enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable Consolidate Reports',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              consolidateReports: true
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Consolidate Reports enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable Consolidate Reports',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              consolidateReports: false
            };

            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Consolidate Reports disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable PullRequestBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enablePullRequestBuild: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s PullRequestBuildWorkflow enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable PullRequestBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enablePullRequestBuild: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s PullRequestBuildWorkflow disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable CommitBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableCommitBuild: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s CommitBuildWorkflow enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable CommitBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableCommitBuild: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s CommitBuildWorkflow disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable TagBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableTagBuild: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s TagBuildWorkflow enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable TagBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableTagBuild: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s TagBuildWorkflow disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Clear ProjectTimeout',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              clearTimeoutMS: true
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s clearProjectTimeoutWorkflow ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable Serialization',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serialize: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SerializationWorkflow enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable Serialization',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serialize: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SerializationWorkflow disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Enable ReleaseBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableReleaseBuild: true
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s ReleaseBuildWorkflow enable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Disable ReleaseBuilds',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                enableReleaseBuild: false
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s ReleaseBuildWorkflow disable ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Get ProjectsById',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            shippable.getProjectById(projectId,
              function (err, proj) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s Failed to get project for projectId:' +
                      ' %s failed with error: %s', testSuiteDesc, projectId,
                      err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  logger.debug('Get ProjectsById successful for : ' + projectId);
                  branches = proj.branches;
                  return done();
                }
              }
            );
          }
        );

        it('Add SerializedBranch',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serializeBranches: branches
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s add SerializedBranch for ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('Remove SerializedBranch',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var update = {
              propertyBag: {
                serializeBranches: branches
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s remove SerializedBranch for ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('SaveBranchFilter',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var val = {
              branchFilter: branches
            };
            var update = {
              propertyBag: {
                dashboardBranchSettings: val
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SaveBranchFilter for ' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('SaveRunFilter for commit only',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var val = {
              runFilter: 'commit'
            };
            var update = {
              propertyBag: {
                dashboardBranchSettings: val
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SaveRunFilter for commit' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
                  return done();
                }
              }
            );
          }
        );

        it('SaveRunFilter for commit and pull requests',
          function (done) {
            this.timeout(0);
            if (!projectId) return done();

            var val = {
              runFilter: 'all'
            };
            var update = {
              propertyBag: {
                dashboardBranchSettings: val
              }
            };
            shippable.putProjectById(projectId, update,
              function (err) {
                if (err) {
                  isTestFailed = true;
                  var testCase =
                    util.format(
                      '\n - [ ] %s SaveRunFilter for commit and pull requests' +
                      'projectId: %s failed with error: %s',
                      testSuiteDesc, projectId, err);
                  testCaseErrors.push(testCase);
                  assert.equal(err, null);
                  return done();
                } else {
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
                    logger.warn('Creating Issue failed with error: ', err);
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

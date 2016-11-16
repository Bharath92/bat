'use strict';
var mocha = require('mocha'),
    Shippable = require('../../../lib/shippable/shippable.js'),
    BitbucketAdapter = require('../../../lib/shippable/BitbucketAdapter.js'),
    nconf = require('nconf'),
    assert = require('assert'),
    async = require('async'),
    bunyan = require('bunyan'),
    logger = bunyan.createLogger({ name: 'Test Case 3.1.3: ' + 
      'Using BB Token verify the count of projects for the account'});

describe('Test Case 3.1.3: Using bitbucket token,' ,
 function() {
  this.timeout(0);
  var shippable = null;
  var bitbucketAdapter = null;

  nconf.argv().env().file({
    file: '../../../config',
    format: nconf.formats.json
  });
  nconf.load();

  it('verify count of projects', function(done) {
    var store = {};
    store.totalReposReturnedByBitbucket = 0;
    store.totalProjectsOnShippable = 0;

    var shipayefive = nconf.get('testAccounts:shipayefive');
    assert(shipayefive);
    assert(shipayefive.apiToken);
    shippable = new Shippable(nconf.get('apiEndpoint'), shipayefive.apiToken);

    async.series([
      getProjectsListFromShippable.bind(null, store),
      getProjectsListFromBitbucket.bind(null, store)
    ], function (err) {
      if (err) {
        logger.error(err);
      }
      assert.equal(store.totalReposReturnedByBitbucket,
       store.totalProjectsOnShippable);
      done();
    });

    function getProjectsListFromShippable (store, next) {

      logger.info('Getting list of projects from shippable');

      shippable.getAllProjects(function(err, projects) {
        assert.equal(err, null);
        store.totalProjectsOnShippable = projects.length;
        logger.info('Total number of repos which the user has' +
          ' access to on shippable', projects.length);
        next();
      });
    }

    function getProjectsListFromBitbucket (store, next) {

      logger.info('Getting list of projects from Bitbucket');

      bitbucketAdapter = new BitbucketAdapter(shipayefive.providerToken);

      bitbucketAdapter.getDashboardRepositories(
        function (err, subscriptionAndRepos) {

        assert.equal(err, null);

        if (!subscriptionAndRepos || !Array.isArray(subscriptionAndRepos)) {
          return next();
        }

        subscriptionAndRepos.forEach(function (subscriptionAndRepo) {
          // Each element in the array returned by Bitbucket is another array,
          // where the first element is the owner (subscription) of the repos
          // listed in the second element.
          if (!Array.isArray(subscriptionAndRepo) ||
              !subscriptionAndRepo[0] || !subscriptionAndRepo[1] ||
              !Array.isArray(subscriptionAndRepo[1])) {
            // Make sure that it is an owner and a list of repos for that owner.
            return;
          }

          subscriptionAndRepo[1].forEach(function (repo) {
            if (!repo || !repo.slug) return;
            if (repo.scm && repo.scm !== 'git') {
              // Currently we support only git. 
              // Exclude Mercurial Repos
              return;
            }
            store.totalReposReturnedByBitbucket += 1;
          });
        });

        logger.info('Total number of repos returned by Bitbucket ',
           store.totalReposReturnedByBitbucket);
        next();
      });
    }
  });
});

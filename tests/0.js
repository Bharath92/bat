'use strict';

var start = require('../test.js');
var mocha = require('mocha');
var nconf = require('nconf');
var chai = require('chai');
var testSuiteNum = '0.';
var testSuiteDesc = 'Setup empty testAccounts objects';
var adapter = require('../_common/shippable/github/Adapter.js');
var Shippable = require('../_common/shippable/Adapter.js');
var _ = require('underscore');
var assert = chai.assert;

describe(util.format('%s1 - %s', testSuiteNum, testSuiteDesc),
  function () {
    var pathToJson = process.cwd() + '/config.json';
    nconf.argv().env().file({
        file: pathToJson, format: nconf.formats.json
      }
    );
    nconf.load();
    var tokens = {
      "owner": {
        "id": "",
        "apiToken": nconf.get("shiptest-github-owner:apiToken")
      },
      "member": {
        "id": "",
        "apiToken": nconf.get("shiptest-github-member:apiToken")
      }
    };

    before(function(done) {
      // runs before all tests in this block
      start = new start(nconf.get("shiptest-github-owner:apiToken"),
                nconf.get("GITHUB_ACCESS_TOKEN_OWNER"));
      return done();
    });

    it('Get /accounts',
      function (done) {
        this.timeout(0);

        console.log("config.apiToken is::",config.apiToken);
        async.each(tokens,
          function(token, nextToken) {
            var shippable = new Shippable(token.apiToken);
            shippable.getAccounts('',
              function(err, res) {
                if (err) {
                  var bag = {
                    testSuite: 'Get /accounts',
                    error: err
                  }
                  async.series([
                      _createIssue.bind(null, bag)
                    ],
                    function (err) {
                      if (err) {
                        logger.warn('Failed');
                      }
                      else {
                        logger.debug('Issue Created');
                      }
                      assert.equal(err, null);
                      return nextToken();
                    }
                  );
                } else {
                  logger.debug("res is::", util.inspect(res,{depth:null}));
                  if (res.status<200 || res.status>=299)
                    logger.warn("status is::",res.status);
                  token.id = _.first(res).id;
                  return nextToken();
                }
              }
            );
          },
          function (err) {
            if (err)
              console.log("Failed");
            return done();
          }
        );
      }
    );

    it('Should save accountIds to config file',
      function (done) {
        nconf.set('shiptest-github-owner:accountId',tokens.owner.id);
        nconf.set('shiptest-github-member:accountId',tokens.member.id);
        nconf.save(function(err){
          if (err)
            console.log("Failed");
          return done();
        });
      }
    );
  }
);

function _createIssue(bag,next) {
  var githubAdapter = new adapter(config.githubToken, config.githubUrl);
  var title = util.format('Failed test case %s', bag.testSuite);
  var body = util.format('Failed with error: %s', bag.error);
  var data = {
    title: title,
    body: body
  }
  githubAdapter.pushRespositoryIssue('deepikasl', 'VT1', data,
    function(err, res) {
      logger.debug("response is::",res.status);
      if (err)
        logger.warn("Creating Issue failed with error: ", err);
      return next();
    }
  );
}

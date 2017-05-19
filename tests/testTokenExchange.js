'use strict';

var nconf = require('nconf');
var async = require('async');
var request = require('request');

var bag = {};

describe('Get shippable token',
  function () {
    this.timeout(0);

    var pathToJson = process.cwd() + '/config.json';
    nconf.argv().env().file({
        file: pathToJson, format: nconf.formats.json
      }
    );
    nconf.load();
    var tokens = {
      owner: {
        githubToken: nconf.get('GITHUB_ACCESS_TOKEN_OWNER'),
        bitbucketToken: nconf.get('BITBUCKET_ACCESS_TOKEN_OWNER'),
        apiToken: ''
      },
      member: {
        githubToken: nconf.get('GITHUB_ACCESS_TOKEN_MEMBER'),
        bitbucketToken: nconf.get('BITBUCKET_ACCESS_TOKEN_MEMBER'),
        apiToken: ''
      }
    };

    before(function(done) {
      async.each(tokens,
        function(token, nextToken) {
          var time = 1;
          var postAuth = function () {
            request({
              url: nconf.get('API_URL') +
                '/accounts/auth/58a42b0007c7cf1300b9a828',
              method: 'POST',
              json: {
                accessToken: token.githubToken
              }
            },
            function (err, res, body) {
              if (res && res.statusCode > 499 || err) {
                time *= 2;
                if (time > 64) time = 2;
                var statusCode = (res && res.statusCode) || 'connection error';
                console.log('Status code: ' + statusCode + '. Retrying in ' +
                  time + ' seconds.');
                return setTimeout(postAuth, time * 1000);
              } else if (res && res.statusCode !== 200) {
                console.log('Failed with statusCode: '+ res.statusCode +
                  ' & error: ', body);
                return nextToken(err);
              } else {
                bag.body = body;
                token.apiToken = body.apiToken;
                return nextToken();
              }
            }
          );
        };
        postAuth();
      },
        function (err) {
          if (err)
            console.log('Failed');
          return done();
        }
      );
    });

    it('Should save tokens in config file',
      function (done) {
        nconf.set('shiptest-github-owner:apiToken',tokens.owner.apiToken);
        nconf.set('shiptest-github-member:apiToken',tokens.member.apiToken);
        nconf.save(function (err) {
          if (err)
            console.log('Failed');
          return done();
        });
      }
    );
  }
);

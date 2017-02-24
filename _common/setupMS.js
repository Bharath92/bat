'use strict';
var self = setupMS;
module.exports = self;

global.util = require('util');
global._ = require('underscore');
global.async = require('async');

function setupMS(params) {
  global.msName = params.msName;
  process.title = params.msName;
  global.config = {};

  if (_.has(params, 'inputQueue'))
    global.config.inputQueue = params.inputQueue;

  global.config.logLevel = 'warn';

  require('./logging/logger.js');
  require('./handleErrors/ActErr.js');

  /* Env Set */
//  global.config.apiUrl = process.env.SHIPPABLE_API_URL;
//  global.config.apiToken = process.env.SHIPPABLE_API_TOKEN;

  global.config.apiUrl = 'https://rcapi.shippable.com';
  global.config.apiToken = params.apiToken;
  global.config.githubUrl = 'https://api.github.com';
  global.config.githubToken = params.githubToken;
}

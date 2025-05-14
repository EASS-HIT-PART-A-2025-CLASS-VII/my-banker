const badRequestJsonResponse = require('./responsesModules/badRequestModule');
const notFoundJsonResponse = require('./responsesModules/notFoundModule');
const unauthorizedJsonResponse = require('./responsesModules/unauthorizedModule');
const internalErrorJsonResponse = require('./responsesModules/internalErrorModule');
const successJsonResponse = require('./responsesModules/successModule');
/**
 * @module jsonResponses
 * @description This module provides functions to send JSON responses with appropriate HTTP status codes.
 */

module.exports = {
  badRequestJsonResponse,
  notFoundJsonResponse,
  unauthorizedJsonResponse,
  internalErrorJsonResponse,
  successJsonResponse,
};
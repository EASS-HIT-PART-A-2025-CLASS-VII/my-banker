const badRequest = require('./responsesModules/badRequestModule');
const notFound = require('./responsesModules/notFoundModule');
const unauthorized = require('./responsesModules/unauthorizedModule');
const internalError = require('./responsesModules/internalErrorModule');
const success = require('./responsesModules/successModule');
/**
 * @module jsonResponses
 * @description This module provides functions to send JSON responses with appropriate HTTP status codes.
 */

module.exports = {
  badRequest,
  notFound,
  unauthorized,
  internalError,
  success,
};
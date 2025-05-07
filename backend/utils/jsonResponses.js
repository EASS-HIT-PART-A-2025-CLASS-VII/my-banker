const badRequest = require('./errorsModules/badRequestModule');
const notFound = require('./errorsModules/notFoundModule');
const unauthorized = require('./errorsModules/unauthorizedModule');
const internalError = require('./errorsModules/internalErrorModule');
/**
 * @module jsonResponses
 * @description This module provides functions to send JSON responses with appropriate HTTP status codes.
 */

module.exports = {
  badRequest,
  notFound,
  unauthorized,
  internalError,
};
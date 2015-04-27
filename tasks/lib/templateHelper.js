'use strict';

exports.init = function (grunt) {

  var _ = require('underscore');

  exports.walkObjects = function (obj, cb) {
    if (_.isArray(obj)) {
      _.each(obj, function (innerObj) {
        exports.walkObjects(innerObj, cb);
      })
    } else {
      if (_.has(obj, 'projectTemplates')) {
        exports.walkObjects(obj.projectTemplates, cb);
      }
      if (_.has(obj, 'appTemplates')) {
        exports.walkObjects(obj.appTemplates, cb);
      }
      if (_.has(obj, 'connectorTemplates')) {
        exports.walkObjects(obj.connectorTemplates, cb);
      }
      if (_.has(obj, 'id')) {
        cb(obj);
      }
    }
  };

  return exports;
};
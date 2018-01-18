module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var History = function () {
  function History() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, History);

    this._log = [];
    this._limit = options.limit || 100;
  }

  _createClass(History, [{
    key: 'import',
    value: function _import(rawData) {
      var _this = this;

      var data = void 0;
      if (typeof rawData === 'string') {
        data = JSON.parse(rawData);
      } else {
        data = rawData;
      }

      if (!(data instanceof Array)) {
        throw new Error('Argument to import must be in array form whether stringified or parsed.');
      }

      data.forEach(function (item, index) {
        var keys = Object.keys(item);
        if (!keys.includes('id') || !keys.includes('timestamp') || !keys.includes('data')) {
          throw new Error('Check the shape of the item at index ' + index + ' of imported array.\n' + 'It must include the keys "id", "data", and "timestamp".');
        }
        _this._log.push(item);
      });
      this._log.sort(function (a, b) {
        return b.id - a.id;
      });
      this._log = this._log.slice(0, this._limit);
      return this.toArray();
    }
  }, {
    key: 'insert',
    value: function insert(item) {
      if (!item || (typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object' && typeof item !== 'string' || typeof item == 'string' && item.length === 0) {
        throw new Error('Item must be an object or non-empty string');
      }

      var inserted = new Date();
      var oldLog = this._log;
      var newLog = [{
        id: inserted.getTime(),
        timestamp: inserted.toISOString(),
        data: item
      }].concat(oldLog);
      this._log = newLog.slice(0, this._limit);
      return oldLog;
    }
  }, {
    key: 'limit',
    value: function limit() {
      return this._limit;
    }
  }, {
    key: 'newest',
    value: function newest() {
      return this._log[0];
    }
  }, {
    key: 'oldest',
    value: function oldest() {
      return this._log[this._log.length - 1];
    }
  }, {
    key: 'serialize',
    value: function serialize(start, end) {
      return JSON.stringify(this._log.slice(start, end));
    }
  }, {
    key: 'setLimit',
    value: function setLimit(newLimit) {
      if (typeof newLimit !== 'number' || newLimit < 1) {
        throw new Error('newLimit must be a positive number');
      }
      this._limit = Math.floor(newLimit);
      this._log = this._log.slice(0, this._limit);

      return this._limit;
    }
  }, {
    key: 'size',
    value: function size() {
      return this._log.length;
    }
  }, {
    key: 'toArray',
    value: function toArray(start, end) {
      return this._log.slice(start, end);
    }
  }]);

  return History;
}();

module.exports = History;

/***/ })
/******/ ]);
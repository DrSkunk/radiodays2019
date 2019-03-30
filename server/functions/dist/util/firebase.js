"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseFunctions = require("firebase-functions");

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_firebaseAdmin.default.initializeApp((0, _firebaseFunctions.config)().firebase);

var _default = _firebaseAdmin.default;
exports.default = _default;
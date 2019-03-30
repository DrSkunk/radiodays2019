"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseFunctions = require("firebase-functions");

var _util = require("../util");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const cors = require('cors')({
  origin: true
});

const db = _util.firebase.database();

const ref = db.ref('/');

var _default = _firebaseFunctions.https.onRequest(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    cors(req, res,
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      try {
        const {
          station,
          name,
          options
        } = req.body;
        console.log('req.body', req.body);
        (0, _util.checkAll)({
          station,
          name,
          options
        });
        console.log(req.body);
        const poll = {
          name,
          options
        };
        const pushedPollKey = (yield ref.child(station).child('polls').push(poll)).key;
        const pollAnswers = {
          name,
          votes: Array(options.length).fill(0)
        };
        yield ref.child(station).child('poll_answers').child(pushedPollKey).update(pollAnswers);
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
      }
    }));
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = _default;
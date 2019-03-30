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
          action
        } = req.query;
        const {
          pollId,
          station
        } = req.body;
        (0, _util.checkAll)({
          station
        });
        console.log(req.query);

        switch (action) {
          case 'activate':
            (0, _util.checkAll)({
              pollId
            });
            yield ref.child(station).child('polls').update({
              active_poll: pollId
            });
            break;

          case 'deactivate':
            yield ref.child(station).child('polls').update({
              active_poll: ''
            });
            break;

          case 'displayResults':
            yield ref.child(station).child('polls').update({
              display_results: true
            });
            break;

          case 'hideResults':
            yield ref.child(station).child('polls').update({
              display_results: false
            });
            break;

          default:
            throw new Error('Invalid action');
        } //   const { station, name, choices } = req.body;
        //   console.log('req.body', req.body);
        //   checkAll({ station, name, choices });
        //   console.log(req.body);
        //   const poll = { name, choices };
        //   const pushedPollKey = (await ref
        //     .child(station)
        //     .child('polls')
        //     .push(poll)).key;
        //   const pollAnswers = { name, votes: Array(choices.length).fill(0) };
        //   await ref
        //     .child(station)
        //     .child('poll_answers')
        //     .child(pushedPollKey)
        //     .update(pollAnswers);


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
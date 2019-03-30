"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkAll;

function checkAll(items) {
  Object.keys(items).forEach(key => {
    const value = items[key];

    if (value === undefined) {
      throw new Error(`${key} is required`);
    }
  });
}
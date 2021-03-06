"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (_, options) => ({
  plugins: [
    [ require.resolve('./for.js'), options ],
    [ require.resolve('./if.js'), options ],
  ]
})

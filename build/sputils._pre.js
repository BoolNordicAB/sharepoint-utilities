function $_global_sputils () {
'use strict';

/*!
https://github.com/BoolNordicAB/sharepoint-utilities
**/

// The MIT License (MIT)
//
// Copyright (c) 2015 contributors (see CONTRIBUTORS file)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// intentionally partial definitions

(function (global, undefined) {

global.sputils = global.sputils || {};
var sputils = global.sputils;

// This can be used internally to do debugging stuff conditionally.
// You are free to set this to `true`, which will enable logging
// and other debugging tools.
sputils.DEBUG = false;

// TODO: consider not throwing an error here.
// this disallows loading this library before any SP libs,
// and that may be preferable sometimes, perhaps?
_spPageContextInfo = _spPageContextInfo || (function () {
  throw Error('_spPageContextInfo not found');
})();

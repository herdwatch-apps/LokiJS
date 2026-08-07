# LokiJS

## Why this fork exists

Forked from [upstream](https://github.com/techfort/LokiJS) because we needed IndexedDB persistence fixes for our Capacitor/Cordova mobile app and official TypeScript types that upstream doesn't ship.

Published as [`@herdwatch/lokijs`](https://www.npmjs.com/package/@herdwatch/lokijs).

Changes from upstream (diffed against upstream tag `v1.5.8`, matching our pinned `1.5.8-dev.9`):
- Adds a hand-written `index.d.ts` so the library type-checks in our strict-TypeScript codebase (upstream ships no types).
- Hardens the IndexedDB adapters for Capacitor/Cordova WebViews: per-database IndexedDB stores, an `onversionchange` recovery hook, and error callbacks instead of thrown exceptions on IDB open/blocked/upgrade — working around a known WebKit IndexedDB bug (see `ionic-team/cordova-plugin-ionic-webview#354` and `ionic-team/capacitor#7439`, referenced directly in the code comments).
- Fixes a real bug where `LokiIndexedAdapter.saveDatabase()` always reported failure on the very first save (before the IndexedDB catalog finished lazily initializing), caused by threading the wrong callback through the retry path.
- Adds performance options (`disableEmitEvents`, `ignoreAutosave`, `serializeDatabaseBeforeSave`, an adaptive-index override for batch inserts) and an `eqJoin` fix supporting array join keys.

[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/techfort/LokiJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![alt CI-badge](https://travis-ci.org/techfort/LokiJS.svg?branch=master)
[![npm version](https://badge.fury.io/js/lokijs.svg)](http://badge.fury.io/js/lokijs)
[![alt packagequality](http://npm.packagequality.com/shield/lokijs.svg)](http://packagequality.com/#?package=lokijs)

## Overview

LokiJS is a document oriented database written in javascript, published under MIT License.
Its purpose is to store javascript objects as documents in a nosql fashion and retrieve them with a similar mechanism.
Runs in node (including cordova/phonegap and node-webkit),  [nativescript](http://www.nativescript.org) and the browser.
LokiJS is ideal for the following scenarios: 

1. client-side in-memory db is ideal (e.g., a session store)
2. performance critical applications
3. cordova/phonegap mobile apps where you can leverage the power of javascript and avoid interacting with native databases
4. data sets loaded into a browser page and synchronised at the end of the work session
5. node-webkit desktop apps
6. nativescript mobile apps that mix the power and ubiquity of javascript with native performance and ui

LokiJS supports indexing and views and achieves high-performance through maintaining unique and binary indexes (indices) for data.

## Demo

The following demos are available:
- [Sandbox / Playground](https://rawgit.com/techfort/LokiJS/master/examples/sandbox/LokiSandbox.htm)
- a node-webkit small demo in the folder demos/desktop_app. You can launch it by running `/path/to/nw demos/desktop_app/`

## Wiki

Example usage can be found on the [wiki](https://github.com/techfort/LokiJS/wiki)

## Main Features

1. Fast performance NoSQL in-memory database, collections with unique index (1.1M ops/s) and binary-index (500k ops/s)
2. Runs in multiple environments (browser, node, nativescript)
3. Dynamic Views for fast access of data subsets
4. Built-in persistence adapters, and the ability to support user-defined ones
5. Changes API
6. Joins

## Current state

LokiJS is at version 1.3 [Eostre].

As LokiJS is written in JavaScript it can be run on any environment supporting JavaScript such as browsers, node.js/node-webkit, nativescript mobile framework and hybrid mobile apps (such as phonegap/cordova).

Made by [@techfort](http://twitter.com/tech_fort), with the precious help of Dave Easterday. 

_[Leave a tip](https://gratipay.com/techfort/) or give us a star if you find LokiJS useful!_

## Installation

For browser environments you simply need the lokijs.js file contained in src/

You can use bower to install lokijs with `bower install lokijs`

For node and nativescript environments you can install through `npm install lokijs`.

## Roadmap

* exactIndex
* key-value datastore
* MRU cache
* MongoDB API compatibility
* server standalone (tcp and http servers and clients)
* replication and horizontal scaling

## Contact

For help / enquiries contact joe.minichino@gmail.com

## Commercial Support

For commercial support contact info.techfort@gmail.com

## License

Copyright (c) 2015 TechFort <joe.minichino@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


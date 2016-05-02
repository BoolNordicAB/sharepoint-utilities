[![Build Status](https://travis-ci.org/BoolNordicAB/sharepoint-utilities.svg?branch=master)](https://travis-ci.org/BoolNordicAB/sharepoint-utilities)

## Resources

[Documentation](https://boolnordicab.github.io/sharepoint-utilities/doc)


[Test coverage](https://boolnordicab.github.io/sharepoint-utilities/coverage/report-html)


## Distribution files **(BLEEDING EDGE)**

[Development version (unminified)](https://boolnordicab.github.io/sharepoint-utilities/dist/sputils.debug.js)


[Production version (minified and mangled)](https://boolnordicab.github.io/sharepoint-utilities/dist/sputils.min.js)


For stable builds, look [at the list of releases](https://github.com/BoolNordicAB/sharepoint-utilities/releases).
As of this moment, none are released. Please refer to the 
[milestones](https://github.com/BoolNordicAB/sharepoint-utilities/milestones) for information.

### Technical details

* uglify reports that sputils.min.js is 31.68 kB
* sputils aim to be compatible with MDS (Minimal Download Strategy).
* sputils re-export the library [functional.js](http://functionaljs.com/) as the symbol `sputils.fjs`
* sputils rely on the following libraries/APIs (excepting SharePoint) under the hood:
    * [`fetch`](https://developer.mozilla.org/en/docs/Web/API/Fetch_API), which is enabled on older platforms by the polyfill [`fetch`](https://github.com/github/fetch). This is a global API, so is usable from all code using `window.fetch`.
    * [`Promise`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), which is enabled on older platforms by [`es6-promise-polyfill`](https://github.com/lahmatiy/es6-promise-polyfill). This is also a global API, and is accessible at `window.Promise`.

## Intro

The intent of this project is to gather best practice in JavaScript interaction with SharePoint. The goal is to provide a unified API through which developers can work. Although there is much to read on the best practices of server side SP development, the same can not be said for client side.

Pull requests are welcome, but please follow the instructions listed further down.

The project is arranged into namespaces, all children of `sputils`. The currently planned namespaces are:
* conversion
* list
* rest
* search
* termstore
* user
* helpers
* lib

Each namespace will be extensively documented with examples and through tests. This will be assisted by the build system.

rest
----

This namespace contains the infrastructure required to easily interact with SharePoint's REST API, both through a series of helper functions designed to take care of the common use cases, and through a low level interface which is little more than a thin wrapper around XHR.

search
------

Because of the size of the SP search REST API it merits its own namespace. This module will combine convenience with best practice, covering the common cases of interaction with the SharePoint search engine and, as far as it is applicable, using sensible defaults.

termstore
---------

Making it a breeze to interact with the SharePoint termstore. Get the terms for a specific term group, either as a list or a tree. Automatically handles custom sort orders configured in the terms.

helpers
-------

Miscellaneous convenience functions, eg promise based SP dependency loading.

lib
---
generic functions that can be used for many different things.

Setup
-----

    $ git clone https://github.com/eakron/sharepoint-utilities.git

[Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) for your OS

    $ sudo npm install -g grunt-cli bower


Specific to the project:

    $ npm run build

Building
--------

Running `npm run build` will create two build artifacts in the dist/ folder: sputils.js and sputils.min.js.

It will also generate docs and coverage in their respective directories.

Committing/pushing
------------------

This project uses husky that automatically runs tasks when committing/pushing. If any errors from these tasks occur, the commit or push will halt and rollback.

Pull requests
-------------

Read CONTRIBUTING.md before making a pull request.

New code is expected to follow the general style of existing code. Please take the time to familiarize yourself with the code base. Make sure you are not reinventing the wheel, some functionality you need may already exist. It is recommended to use an EditorConfig plugin for your text editor. All new API functions must be covered by tests.

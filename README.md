sharepoint-utilities
====================

The intent of this project is to gather best practice in JavaScript interaction with SharePoint. The goal is to provide a unified API through which developers can work. Although there is much to read on the best practices of server side SP development, the same can not be said for client side.

To reduce the complexity of the library it is dependent on jQuery.

Pull requests are welcome, but please follow the instructions listed further down.

The project is arranged into namespaces, all children of `sputils`. The currently planned namespaces are:
* rest
* search
* template
* conversions
* helpers

Each namespace will be extensively documented with examples and through tests. This will be assisted by the build system.

rest
----

This namespace contains the infrastructure required to easily interact with SharePoint's REST API, both through a series of helper functions designed to take care of the common use cases, and through a low level interface which is little more than a thin wrapper around jQuery.

search
------

Because of the size of the SP search REST API it merits its own namespace. This module will combine convenience with best practice, covering the common cases of interaction with the SharePoint search engine and, as far as it is applicable, using sensible defaults.

template
--------

SharePoint-aware templating.

conversions
-----------

Converting between formats, such as AD and Claims.

helpers
-------

Miscellaneous convenience functions.

Setup
------------

    $ git clone https://github.com/eakron/sharepoint-utilities.git

[Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) for your OS

    $ sudo npm install -g grunt-cli bower


Specific to the project:

    $ npm install

    $ bower install

    $ grunt

Building
--------

Running `grunt build` will create two build artifacts in the dist/ folder: sputils.js and sputils.min.js.

Pull requests
-------------

Read CONTRIBUTING.md before making a pull request.

New code is expected to follow the general style of existing code. Please take the time to familiarize yourself with the code base. Make sure you are not reinventing the wheel, some functionality you need may already exist. It is recommended to use an EditorConfig plugin for your text editor. All new API functions must be covered by tests.

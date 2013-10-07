sharepoint-utilities
====================

The intent of this project is to gather best practice in JavaScript interaction with SharePoint. The goal is to provide a unified API through which developers can work. Although there is much to read on the best practices of server side SP development, the same can not be said for client side.

The project is arranged into namespaces, all children of `sputils`. The currently planned namespaces are:
* rest
* search
* template
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

helpers
-------

Miscellaneous convenience functions.

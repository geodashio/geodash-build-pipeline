# GeoDash Build Pipeline (geodash-build-pipeline)

Low-level Javascript library for the [GeoDash](http://geodash.io) Gulp-based build pipeline.  This API includes a variety of low-level functions that can be used throughout a `gulpfile`.

## GeoDash

GeoDash is a modern web framework and approach for quickly producing visualizations of geospatial data. The name comes from "geospatial dashboard".

The framework is built to be extremely extensible. You can use GeoDash Server (an implementation), the front-end framework, backend code, or just the Gulp pipeline. Have fun!

See [http://geodash.io](http://geodash.io) for more details.

# Install

Install with [npm](https://npmjs.org/package/geodash-build-pipeline)

```
npm install geodash-build-pipeline --save-dev
```

# Usage

This library should be used in a `gulpfile` when building a GeoDash application.  It is not developed for the GeoDash `runtime` environment in the browser, as such the package is prefixed with `geodash-build-`.  To load into a gulpfile, add the following:

```
var geodash = require("geodash-build-pipeline");
```

You can then use functions like:

```
geodash.resolve.path(...)
geodash.log.error(...)
```

Build the docs for the full API.  For an example see the GeoDash Viewer [gulpfile.js](https://github.com/geodashio/geodash-viewer-angular/blob/master/gulpfile.js).

# Building

## Docs

To build the custom docs template used in the website, you'll need to install a custom version of docstrap.git on top of the default version.  The below command will install the custom version.

```
npm install git+https://git@github.com/geodashio/docstrap.git\#geodash # Install custom docs template with font awesome
```

You can just build docs with:
```
npm run build:docs # or gulp docs since run the same thing
```

# Tests

Only [jshint](http://jshint.com/about/) is supported right now.  Run tests with the following command.

```
npm run tests
```

# Contributing

Happy to accept pull requests!

# License

See `LICENSE` file.

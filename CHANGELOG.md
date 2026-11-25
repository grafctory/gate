# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> Published as `@grafctory/gate` from version 0.14.1; earlier versions were published as `@metreeca/gate`.

## [Unreleased](https://github.com/grafctory/gate/compare/v0.14.1...HEAD)

## [0.14.1](https://github.com/grafctory/gate/compare/v0.14.0...v0.14.1) - 2026-11-24

### Changed

- Maintenance release with no change to the published API or behaviour

## [0.14.0](https://github.com/grafctory/gate/compare/v0.13.0...v0.14.0) - 2026-11-19

### Changed

- **Breaking**: Upgrade `@metreeca/blue` and `@metreeca/qest` to `^0.15.0` and `@metreeca/keep` to `^0.14.0`; projects
  using them alongside this package raise their own ranges to match, so that each of them is shared as a single copy

## [0.13.0](https://github.com/grafctory/gate/compare/v0.12.0...v0.13.0) - 2026-11-17

### Added

- Let `server()` take a `@metreeca/keep` scope bounding the page size, nesting and aggregates client templates may ask
  for on every driver at once; its `locale` serves requests whose `Accept-Language` header names no language
- Let `driver()` take a `virtual` option serving a resource derived from the store rather than held in it, such as a
  listing of every instance of a class; virtual drivers support `lookup()` only and reject writes with a `TypeError`

### Changed

- **Breaking**: Upgrade `@metreeca/blue`, `@metreeca/core` and `@metreeca/qest` to `^0.14.0`, `@metreeca/keep` and
  `@metreeca/tape` to `^0.13.0` and `@metreeca/http` to `^0.6.0`; projects using them alongside this package raise
  their own ranges to the same versions, so that each of them is shared as a single copy
- Let client templates retrieve hidden members by naming them: `hidden` is presentational and only leaves a member out
  of the default view served to a request carrying no query component, whatever the server template states
- **Breaking**: Reject with `422 Unprocessable Content` client templates naming undeclared members, stating malformed
  entries or entries conflicting with the server template, which were silently dropped or replaced by the server
  entry; clients drop or correct the offending entries, which no longer fall back to the server template
- **Breaking**: Serve client `#` page sizes as stated, rather than capped by the server template; applications relying
  on the server template to cap them set `server(store, { limit })`, which rejects oversized requests instead
- **Breaking**: Reject with `422 Unprocessable Content` `PUT` bodies naming a resource other than the request target,
  and `POST` bodies stating an identifier that is not a string, rather than silently replacing the identifier they
  state; clients omit the identifier, or state the request target in `PUT` bodies and a string in `POST` bodies

### Removed

- **Breaking**: Remove the `LookupHooks` and `WriteHooks` types and the `scope` retrieval hook: bound retrieval once
  for the whole application with `server(store, scope)`, which every route enforces, and derive the hook types where
  needed as `Parameters<Driver["lookup"]>[0]` and `Parameters<Driver["create"]>[0]`

### Fixed

- Mark `Driver.lookup()` responses as varying by `Accept-Language`, so that HTTP caches no longer serve content
  localised for one language to requests asking for another

## [0.12.0](https://github.com/grafctory/gate/compare/v0.11.0...v0.12.0) - 2026-10-22

### Added

- Add `@metreeca/gate/driver`: `driver()` serves the resources a `@metreeca/blue` shape describes as a REST/JSON API,
  enabling retrieval, creation, replacement and removal per route, with no handler code to write
- Let `server()` take the `@metreeca/keep` store holding the resources served by every driver of the application
- Add `ServerOpts.base`, the canonical IRI identifying served resources wherever the server runs; IRIs sharing its
  scheme and authority are exchanged with clients in root-relative form, in payloads and `Location` headers alike

### Changed

- Declare `express` as a peer dependency and `@types/express` as an optional one: applications now install `express`
  themselves, choosing the Express release their own routes build on alongside the package
- Depend on `@metreeca/blue` `^0.13.1`, `@metreeca/keep` `^0.12.2` and `@metreeca/qest` `^0.13.0`, imported by drivers

### Security

- Upgrade `vite` to `8.3.5`, `vitest` to `4.1.12` and `markdown-it` to `14.3.3`, clearing the advisories `npm audit`
  raised against them (development dependencies only, so applications installing the package are unaffected)

## [0.11.0](https://github.com/grafctory/gate/compare/v0.10.0...v0.11.0) - 2026-10-19

### Added

- `Server` and `ServerOpts`: the type of the applications created by `server()`, and the options of their `listen()`
- `ServerOpts.signal`: closes the server on demand when aborted, as `SIGINT` or `SIGTERM` would
- `@metreeca/gate/client`: `client()` serves a browser client from the same origin as the API; client-side addresses
  survive reloads, and HTTP caches keep pages apart from API responses for the same address
- `@metreeca/gate/worker`: `worker()` runs an asynchronous action on each request, answering `200 OK` once it
  completes and passing its failures on to the error middleware of the surrounding stack

### Changed

- `server()` creates an Express application served over HTTP by its own `listen()`, replacing `server.start()` and
  `server.stop()`; `listen()` returns a promise that settles once the server is closed by its signal or by the process
- `ServerOpts.host` rejects addresses containing whitespace as malformed
- `ServerOpts.port` defaults to a free port assigned by the operating system instead of `8080`
- `ServerOpts.proxies` defaults to `0` instead of `1`, trusting no forwarded caller address unless proxies are declared
- `shutdown` option renamed to `ServerOpts.grace`, and also applied when the server is closed through its signal
- Upgrade `@metreeca/core` to `^0.13.0`
- Upgrade `@metreeca/http` to `^0.5.0`
- Upgrade `@metreeca/tape` to `^0.12.0`

### Removed

- Dependencies on `@metreeca/blue`, `@metreeca/keep` and `@metreeca/qest`, which no module of the package imports

## [0.10.0](https://github.com/grafctory/gate/compare/v0.9.1...v0.10.0) - 2026-10-14

### Added

- `server`: HTTP server hosting an Express router behind a proxy, with request tracing, bodiless error responses and
  graceful shutdown on `SIGINT` and `SIGTERM`

### Changed

- Upgrade `@metreeca/blue` to `^0.12.1`
- Upgrade `@metreeca/core` to `^0.12.1`
- Upgrade `@metreeca/http` to `^0.4.1`
- Upgrade `@metreeca/keep` to `^0.11.1`
- Upgrade `@metreeca/qest` to `^0.12.1`
- Upgrade `@metreeca/tape` to `^0.11.1`
- requires `@metreeca/blue` `^0.12.0`, `@metreeca/core` `^0.12.0`, `@metreeca/keep` `^0.11.0` and `@metreeca/qest`
  `^0.12.0`
- requires `@metreeca/http` `^0.4.0`, `@metreeca/tape` `^0.11.0` and `express` `^5.3.0`

## [0.9.1](https://github.com/grafctory/gate/compare/v0.9.0...v0.9.1) - 2026-09-09

### Changed

- requires `@metreeca/blue` `^0.10.0`, `@metreeca/core` `^0.10.0`, `@metreeca/keep` `^0.10.0` and `@metreeca/qest`
  `^0.10.0`, so that the package resolves the storage framework rather than the placeholder `@metreeca/keep` `0.9.0`
  claimed the name with

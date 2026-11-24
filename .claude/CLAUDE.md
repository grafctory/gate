---
title: Project Guidelines
description: Development guidelines and conventions for the @grafctory/gate package.
---

# References

## Dependencies

- [@grafctory/core](https://github.com/grafctory/core) - Core utilities and shared types
- [@grafctory/qest](https://github.com/grafctory/qest) - Linked data models and query languages
- [@grafctory/blue](https://github.com/grafctory/blue) - Model-driven linked data modeling
- [@grafctory/keep](https://grafctory.github.io/keep/) - Model-driven linked data storage

# NPM Scripts

- **`npm run clean`** - Remove dependencies and build artefacts
- **`npm run prime`** - Install dependencies from the lockfile
- **`npm run setup`** - Install dependencies and link sibling `@grafctory/*` repositories
- **`npm run build`** - Compile sources and generate docs
- **`npm run check`** - Run the test suite
- **`npm run proof`** - Serve live docs

> [!CAUTION]
> **`prime` and `setup` are not interchangeable.** Run `prime` when finalising a public release: `@grafctory/*` imports
> resolve to the published releases recorded in the lockfile. Run `setup` for local development against unpublished
> sibling branches: imports resolve to the working copies in the neighbouring repositories.

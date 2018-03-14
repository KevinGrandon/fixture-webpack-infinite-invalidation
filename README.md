# Webpack4 - Infinite reload fixutre

This is a minimal reproduction of our Webpack environment, ported from 3 to 4, which causes an infinite load with no debug data.

Reproduction:

```bash
# Clone this repo.
git clone git@github.com:KevinGrandon/fixture-webpack-infinite-invalidation.git && cd fixture-webpack-infinite-invalidation

# Install dependencies:
yarn

# Run our test script
node test/test.js

## !important (Recommend that you cmd/ctrl + c to quit the running process once you reproduce it restarting as it continues to fork processes and eat up all your memory)
```

## Actual results

The progress plugin will continually start over from 0.

## Expected results

We compile successfully, or at least shown an error message as to why things failed.

## Architecture

The compiler is located within build/compiler.js.

test/test.js executes the compiler from within child_process.spawn().

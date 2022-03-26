# `unplugin-transform-imports`

[![NPM Publish](https://github.com/VdustR/unplugin-transform-imports/actions/workflows/build.yml/badge.svg)](https://github.com/VdustR/unplugin-transform-imports/actions/workflows/build.yml)

An imports transform [unplugin](https://github.com/unjs/unplugin) based on [babel](https://github.com/babel/babel) inspired by [`babel-plugin-transform-imports`](https://www.npmjs.com/package/babel-plugin-transform-imports).

## What `unplugin-transform-imports` Do?

Transform the imports from:

```ts
import { Check as MdiCheck } from "mdi-material-ui";
import { Check as MuiCheck, CheckBox } from "@mui/icons-material";
import { Check as PhCheck } from "phosphor-react";
import { merge } from "lodash";
```

to:

```ts
import MdiCheck from "mdi-material-ui/Check";
import MuiCheck from "@mui/icons-material/Check";
import CheckBox from "@mui/icons-material/CheckBox";
import PhCheck from "phosphor-react/dist/icons/Check";
import merge from "lodash/merge";
```

## Why `unplugin-transform-imports`?

### Better Development Performance

> Development bundles can contain the full library which can lead to slower startup times. This is especially noticeable if you import from @mui/icons-material. Startup times can be approximately 6x slower than without named imports from the top-level API.

- Reference from [MUI Minimizing bundle size #Development environment](https://mui.com/guides/minimizing-bundle-size/#development-environment)

You can save a lot of time if you use webpack.

There are rough test results with [`demo-craco`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-craco) on my device:

```bash
# without unplugin-transform-imports
$ pnpm start
webpack 5.70.0 compiled successfully in 22427 ms

# with unplugin-transform-imports
$ pnpm start
webpack 5.70.0 compiled successfully in 3313 ms
```

### Tree-shaking Alternative

You can also use it as tree-shaking alternative for modules which is not using ESM like lodash.

[`demo-craco`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-craco):

```bash
# without unplugin-transform-imports
$ du -h --max-depth=0 build
1.6M    build

# with unplugin-transform-imports
$ du -h --max-depth=0 build
980K   build
```

[`demo-vite`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-vite):

```bash
# without unplugin-transform-imports
du -h --max-depth=0 dist
280K    dist

# with unplugin-transform-imports
du -h --max-depth=0 dist
220K    dist
```

## How To Use `unplugin-transform-imports`

Install:

```sh
npm i -D unplugin-transform-imports
yarn add -D unplugin-transform-imports
pnpm i -D unplugin-transform-imports
```

Usage:

```ts
import transformImports from "unplugin-transform-imports";

// webpack
transformImports.webpack(transformImportsOptions);

// vite
transformImports.vite(transformImportsOptions);

// rollup
transformImports.rollup(transformImportsOptions);

// esbuild
transformImports.esbuild(transformImportsOptions);
```

You can check the demo for `craco` and `vite`:

- [`demo-craco`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-craco)
- [`demo-vite-react`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-vite)
- [`demo-vite-vue`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-vite-vue)
- [`demo-vite-svelte`](https://github.com/VdustR/unplugin-transform-imports/blob/main/packages/demo-vite-svelte)

### transformImportsOptions

```ts
const defaultOptions = {
  enforce = undefined, // "pre" | "post" | undefined
  cwd = defaultCwd, // default: process.cwd()
  modules = [], // See Module
  includes = ["**/*.{tsx,ts,jsx,js,mjs}"],
  excludes = ["node_modules"],
  parseOptions, // Optional. See: https://babeljs.io/docs/en/babel-parser#options
  transformOptions, // Optional. See: https://babeljs.io/docs/en/options
};
```

#### Module

```ts
transformImports.vite({
  modules: [
    {
      path: "lodash", // the module name to replace
    },

    // You can get the same results with these transform options:
    {
      path: "lodash", // the module name to replace
      transform: `\${moduleName}/\${importName}`,
    },
    {
      path: "lodash",
      transform: (importName, moduleName) => `${moduleName}/${importName}`,
    },
  ],
});

// This will make:
import { merge } from "lodash";

// be transformed to:
import merge from "lodash/merge";
```

There are three variables for the transform function and the transform template. They are `importName`, `moduleName` and `constName`. It's depends on the original code:

```ts
import { [importName] } from "[moduleName]"; // constName === importName
import { [importName] as [constName] } from "[moduleName]";
```

You can use them in a transform template:

```ts
const module = {
  path: "lodash",
  transform: `\${moduleName}/\${importName}/\${constName}`,
};
```

or in transform function:

```ts
const module = {
  path: "lodash",
  transform: (importName, moduleName, constName) =>
    `${moduleName}/${importName}/${constName}`,
};
```

### `transformImports()`

You can use `transformImports()` function directly without unplugin:

```ts
import transformImports from `unplugin-transform-imports/transformImports`;

const transformedCode:string = transformImports(
  code,
  {
    modules, // See Module
    parseOptions, // Optional. See: https://babeljs.io/docs/en/babel-parser#options
    transformOptions, // Optional. See: https://babeljs.io/docs/en/options
  }
);
```

## Development

```sh
# init
pnpm i

# build
pnpm build

# install again to link production
pnpm i

## go to the demo
cd packages/demo-{theDemoPath}
```

## Test

```sh
pnpm test
```

## LICENSE

[MIT](https://github.com/VdustR/unplugin-transform-imports/blob/main/LICENSE)

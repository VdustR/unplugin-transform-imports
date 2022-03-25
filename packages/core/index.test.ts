import transformImports from ".";
import { expect, it } from "vitest";
import { build } from "vite";
import { resolve } from "path";
import type { OutputChunk, RollupOutput } from "rollup";

it("Test build", async () => {
  const rollupOutput = await build({
    root: resolve(__dirname, "test"),
    configFile: false,
    plugins: [
      transformImports.vite({
        modules: [
          { path: "foo" },
          {
            path: "@bar/core",
            transform: "@bar/core/${importName}",
          },
          {
            path: "baz",
            transform: `\${moduleName}/\${importName}/\${importName}/deep/\${constName}/\${constName}`,
          },
          {
            path: "@qux/core",
            transform: "@qux/core/${constName}",
          },
          {
            path: "quux",
            transform: (importName) => `quux/dist/${importName}`,
          },
          {
            path: "@corge/react",
            transform: (importName, moduleName, constName) =>
              `${moduleName}/dist/${importName}/${importName}/deep/${constName}/${constName}`,
          },
          {
            path: "grault-vue",
            transform: (_importName, _moduleName, constName) =>
              `grault-vue/dist/${constName}`,
          },
        ],
      }),
    ],
    build: {
      minify: false,
      polyfillModulePreload: false,
      rollupOptions: {
        external: [
          /^foo(\/.+)?/,
          /^@bar\/core(\/.+)?/,
          /^baz(\/.+)?/,
          /^@qux\/core(\/.+)?/,
          /^quux(\/.+)?/,
          /^@corge\/react(\/.+)?/,
          /^grault-vue(\/.+)?/,
        ],
      },
    },
  });
  expect(
    (
      (rollupOutput as RollupOutput).output.find(
        ({ type }) => type === "chunk"
      ) as OutputChunk
    ).code
  ).toMatchSnapshot();
});

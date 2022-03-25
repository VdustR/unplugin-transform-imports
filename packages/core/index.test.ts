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
          { path: "lodash" },
          {
            path: "@mui/icons-material",
            transform: "@mui/icons-material/$1",
          },
          {
            path: "phosphor-react",
            transform: (importName) => `phosphor-react/src/icons/${importName}`,
          },
          {
            path: "mdi-material-ui",
          },
        ],
      }),
    ],
    build: {
      minify: false,
      polyfillModulePreload: false,
      rollupOptions: {
        external: [
          /^lodash(\/.+)?/,
          /^@mui\/icons-material(\/.+)?/,
          /^phosphor-react(\/.+)?/,
          /^mdi-material-ui(\/.+)?/,
          /^react(\/.+)?/,
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

import transformImports from "./transformImports";
import { expect, it } from "vitest";
import { resolve } from "path";
import { readFileSync } from "fs-extra";

const code = readFileSync(resolve(__dirname, "test/index.tsx"), "utf8");

it("Test build", async () => {
  const babelFileResult = await transformImports(code, {
    parseOptions: {
      plugins: ["typescript", "jsx"],
    },
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
  });
  expect(babelFileResult?.code).toMatchSnapshot();
});

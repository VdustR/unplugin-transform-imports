import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const transformImports = require("unplugin-transform-imports");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    transformImports.vite({
      includes: ["**/*.{ts,js,mjs,svelte}"],
      modules: [
        { path: "lodash" },
        {
          path: "phosphor-svelte",
          transform: (importName, moduleName) =>
            `${moduleName}/lib/${importName}`,
        },
      ],
    }),
  ],
});

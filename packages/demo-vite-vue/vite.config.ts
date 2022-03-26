import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import transformImports from "unplugin-transform-imports";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    transformImports.vite({
      enforce: null,
      includes: ["**/*.{ts,js,mjs,vue}"],
      modules: [
        { path: "lodash" },
        {
          path: "phosphor-vue",
          transform: (importName, moduleName) =>
            `${moduleName}/dist/esm/components/${importName}.vue`,
        },
      ],
    }),
  ],
});

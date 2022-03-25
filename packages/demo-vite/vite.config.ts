import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import transformImports from "unplugin-transform-imports";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    transformImports.vite({
      modules: [
        { path: "lodash" },
        {
          path: "@mui/icons-material",
          transform: `\${moduleName}/\${importName}`,
        },
        {
          path: "phosphor-react",
          transform: (importName, moduleName) =>
            `${moduleName}/dist/icons/${importName}.esm.js`,
        },
        {
          path: "mdi-material-ui",
        },
      ],
    }),
    react(),
  ],
});

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
    react(),
  ],
});

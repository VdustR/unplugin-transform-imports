import transformImports from "unplugin-transform-imports";

module.exports = {
  webpack: {
    plugins: {
      add: [
        [
          transformImports.webpack({
            enforce: "pre",
            parseOptions: {
              plugins: ["typescript", "jsx"],
            },
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
          "prepend",
        ],
      ],
    },
  },
};

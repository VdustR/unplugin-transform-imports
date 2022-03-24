import transformImports from "unplugin-transform-imports";

module.exports = {
  webpack: {
    plugins: {
      add: [
        [
          transformImports.webpack({
            modules: [
              { path: "lodash" },
              {
                path: "@mui/icons-material",
                transform: "@mui/icons-material/$1",
              },
              {
                path: "phosphor-react",
                transform: (importName) =>
                  `phosphor-react/dist/icons/${importName}.esm.js`,
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

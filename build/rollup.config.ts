import renameExtensionsModule from "@vdustr/rollup-plugin-rename-extensions";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { RollupOptions } from "rollup";
import typescript from "rollup-plugin-typescript2";
import { MODULE, PKG } from "./type";
import builtinModules from "builtin-modules";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const renameExtensions = (
  renameExtensionsModule as unknown as { default: typeof renameExtensionsModule }
).default;
const packageJson = JSON.parse(
  readFileSync(resolve(repoRoot, "package.json"), "utf8")
);

function genConfig(pkg: PKG, module: MODULE) {
  const isEsm = module === "ES2015";
  const isTyped = isEsm;
  const isTs = true;
  const pkgDir = resolve(repoRoot, "packages", pkg);
  const distDir = resolve(repoRoot, "dist", pkg);
  const config: RollupOptions = {
    input: resolve(pkgDir, "index.ts"),
    output: {
      dir: distDir,
      preserveModules: true,
      format: isEsm ? "esm" : "cjs",
      exports: "auto",
    },
    external: [
      ...Object.keys(packageJson.dependencies).filter((pkg) => "tslib" !== pkg),
      ...builtinModules,
    ],
    plugins: [
      ...(isTs
        ? [
            typescript({
              check: false,
              tsconfig: resolve(__dirname, "esm/tsconfig.json"),
              tsconfigOverride: {
                module,
                declarationDir: ".",
                target: "ES5",
                include: [resolve(pkgDir, `**/*.ts`)],
                exclude: [resolve(pkgDir, `**/*.test.ts`)],
                compilerOptions: {
                  declaration: isTyped,
                },
              },
            }),
          ]
        : []),
      ...(isEsm
        ? []
        : [
            renameExtensions({
              include: ["**/*.ts"],
              match: "\x00tslib.js",
              mappings: {
                ".js": ".cjs",
              },
            }),
          ]),
    ],
  };
  return config;
}

const configs: RollupOptions[] = [
  genConfig(PKG.core, MODULE.ES2015),
  genConfig(PKG.core, MODULE.COMMONJS),
];

export default configs;

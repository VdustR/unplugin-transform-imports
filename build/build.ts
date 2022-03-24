import fs from "fs-extra";
import mkdirp from "mkdirp";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { PKG } from "./type";
import babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import builtinModules from "builtin-modules";
import glob from "glob";
import packageJson from "../package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packagesDir = resolve(__dirname, "../packages");

const targetDir = resolve(__dirname, "../dist");

async function setPackage(packageName: PKG) {
  await mkdirp(resolve(targetDir, packageName));
  await Promise.all([
    fs
      .copyFile(
        resolve(__dirname, "../LICENSE"),
        resolve(targetDir, packageName, "LICENSE")
      )
      .catch(console.trace),
    fs
      .copyFile(
        resolve(__dirname, "../README.md"),
        resolve(targetDir, packageName, "README.md")
      )
      .catch(console.trace),

    fs
      .readFile(resolve(packagesDir, packageName, "package.json"), "utf8")
      .then((packageJson) => JSON.parse(packageJson))
      .then((packageJson) => {
        delete packageJson.private;
        packageJson.main = "index.cjs";
        packageJson.exports = {
          import: "./index.js",
          require: "./index.cjs",
        };
        packageJson.module = "index.js";
        return packageJson;
      })
      .then((packageJson) => {
        fs.writeFile(
          resolve(targetDir, packageName, "package.json"),
          JSON.stringify(packageJson, null, 2),
          { encoding: "utf8" }
        );
      })
      .catch(console.trace),
  ]);
}

await Promise.all(Object.values(PKG).map((pkg) => setPackage(pkg)));

function getModuleName(str: string) {
  const pathArr = str.split("/");
  if (str.match(/^@/)) return `${pathArr[0]}/${pathArr[1]}`;
  return pathArr[0];
}

function getVersion(moduleName: string) {
  const version =
    packageJson.dependencies[
      moduleName as keyof typeof packageJson.dependencies
    ];
  if (!version) throw new Error(`${moduleName} is not found in package.json`);
  return version;
}

async function setDependencies(pkg: PKG) {
  const files = glob.sync(resolve(targetDir, pkg, "**/*.js"));
  const depsMap = new Map<string, string>();
  await Promise.all(
    files.map(async (file) => {
      const jsCode = await fs.readFile(file, "utf8");
      const ast = babelParser.parse(jsCode, {
        sourceType: "module",
      });
      (traverse as unknown as { default: typeof traverse }).default(ast, {
        ImportDeclaration(path) {
          const value = path.node.source.value;
          if (value.match(/^\./)) return;
          const moduleName = getModuleName(value);
          if (!moduleName) return;
          if (builtinModules.includes(moduleName)) return;
          if (depsMap.has(moduleName)) return;
          depsMap.set(moduleName, getVersion(moduleName));
        },
      });
    })
  );
  const depsEntries = [...depsMap.entries()];
  if (depsEntries.length === 0) return;
  const deps = Object.fromEntries(depsEntries);
  const pkgPath = resolve(targetDir, pkg, "package.json");
  const originalPkgContent = JSON.parse(await fs.readFile(pkgPath, "utf8"));
  const fixedPkgContent = { ...originalPkgContent, dependencies: deps };
  await fs.writeFile(pkgPath, JSON.stringify(fixedPkgContent, null, 2), {
    encoding: "utf8",
  });
}

await setDependencies(PKG.core);

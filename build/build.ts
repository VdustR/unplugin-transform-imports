import fs from "fs-extra";
import mkdirp from "mkdirp";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { PKG } from "./type";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packagesDir = resolve(__dirname, "../packages");

const targetDir = resolve(__dirname, "../dist");

async function setPackage(
  packageName: PKG,
  {
    cjsOnly = false,
  }: {
    cjsOnly?: boolean;
  } = {}
) {
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
        if (cjsOnly) {
          packageJson.main = "index.js";
        } else {
          packageJson.main = "index.cjs";
          packageJson.exports = {
            import: "./index.js",
            require: "./index.cjs",
          };
          packageJson.module = "index.js";
        }
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

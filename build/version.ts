import cac from "cac";
import fs from "fs-extra";
import glob from "glob";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const cli = cac();
const __dirname = dirname(fileURLToPath(import.meta.url));

cli
  .command("[version]", "Version number to inject into package.json")
  .action((version) => {
    glob
      .sync(resolve(__dirname, "../dist/*/package.json"))
      .forEach(async (file) => {
        const pkg = JSON.parse(await fs.readFile(file, "utf8"));
        pkg.version = version;
        const depsProperties = ["dependencies", "peerDependencies"];
        depsProperties.forEach((depsProperty) => {
          if (pkg[depsProperty]) {
            Object.keys(pkg[depsProperty]).forEach((dep) => {
              if (dep.startsWith("@g2d/")) {
                pkg[depsProperty][dep] = version;
              }
            });
          }
        });
        await fs.writeFile(file, JSON.stringify(pkg, null, 2), {
          encoding: "utf8",
        });
      });
  });

cli.parse();

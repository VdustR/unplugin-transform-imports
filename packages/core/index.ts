import { createUnplugin } from "unplugin";
import { resolve } from "path";
import * as minimatch from "minimatch";
import type { TransformImportsOptions } from "./type";

const defaultEnforce = "pre";
const defaultCwd = process.cwd();

const transformImports = createUnplugin(
  ({
    enforce,
    cwd = defaultCwd,
    modules = [],
    includes = ["**/*.{tsx,ts,jsx,js,vue,svelte,mjs,md,mdx,svx}"],
    excludes = ["node_modules"],
  }: TransformImportsOptions = {}) => {
    const includesPatterns = includes.map((pattern) =>
      minimatch.makeRe(resolve(cwd, pattern))
    );
    const excludesPatterns = excludes.map((pattern) =>
      minimatch.makeRe(resolve(cwd, pattern))
    );
    return {
      name: "transform-import",
      modules,
      enforce:
        enforce === undefined
          ? defaultEnforce
          : enforce === null
          ? undefined
          : enforce,
      transformInclude(id) {
        return (
          includesPatterns.some((pattern) => pattern.test(id)) &&
          !excludesPatterns.some((pattern) => pattern.test(id))
        );
      },
      transform(code) {
        return code.replace(
          /(^|\s|;)import\s*\{([^}]+)\}\s*from\s*('[^']+'|"[^"]+")\s*;?/g,
          (
            originalMatched,
            prefix: string,
            imports: string,
            moduleNameWithQuote: string
          ) => {
            const moduleName = moduleNameWithQuote.slice(1, -1);
            const matchedTransform = modules.find(
              ({ path }) => path === moduleName
            );
            if (!matchedTransform) return originalMatched;
            const transformer: (
              importName: string,
              moduleName: string,
              constName?: string
            ) => string = (() => {
              const transform = matchedTransform.transform;
              if (!transform)
                return (importName) => `${moduleName}/${importName}`;
              if (typeof transform === "string")
                return (importName, moduleName, constName) =>
                  transform
                    .replaceAll("${importName}", importName)
                    .replaceAll("${moduleName}", moduleName)
                    .replaceAll("${constName}", constName || importName);
              return (importName, moduleName, constName) =>
                transform(importName, moduleName, constName || importName);
            })();
            const transformedImports =
              prefix +
              imports
                .split(",")
                .map((importStr) => importStr.trim().split(" as "))
                .map(([importName, _constName]) => {
                  if (!importName) return "";
                  const constName = _constName || importName;
                  return `import ${constName} from "${transformer(
                    importName,
                    moduleName,
                    constName
                  )}";`;
                })
                .join("\n") +
              "\n";
            return transformedImports;
          }
        );
      },
    };
  }
);

export default transformImports;

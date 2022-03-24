import { createUnplugin } from "unplugin";
import { resolve } from "path";
import * as minimatch from "minimatch";

const defaultEnforce = "pre";
const defaultCwd = process.cwd();

const transformImports = createUnplugin(
  ({
    enforce,
    cwd = defaultCwd,
    modules = [],
    includes = ["**/*.{tsx,ts,jsx,js,vue,svelte,mjs}"],
    excludes = ["node_modules"],
  }: {
    enforce?: "post" | "pre" | null;
    cwd?: string;
    modules?: {
      path: string;
      transform?: string | ((importName: string) => string);
    }[];
    includes?: string[];
    excludes?: string[];
  } = {}) => {
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
            modulePathWithQuote: string
          ) => {
            const modulePath = modulePathWithQuote.slice(1, -1);
            const matchedTransform = modules.find(
              ({ path }) => path === modulePath
            );
            if (!matchedTransform) return originalMatched;
            const transformer: (importName: string) => string = (() => {
              const transform = matchedTransform.transform;
              if (!transform)
                return (importName) => `${modulePath}/${importName}`;
              if (typeof transform === "string")
                return (importName) => transform.replace("$1", importName);
              return (importName) => transform(importName);
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
                    importName
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

export type Enforce = "post" | "pre" | null;
export type Cwd = string;
export type Transform = string | ((importName: string) => string);
export type Module = {
  path: string;
  transform?:
    | string
    | ((importName: string, moduleName: string, constName: string) => string);
};
export type Include = string;
export type Exclude = string;
export type TransformImportsOptions = {
  enforce?: Enforce;
  cwd?: Cwd;
  modules?: Module[];
  includes?: Include[];
  excludes?: Exclude[];
};

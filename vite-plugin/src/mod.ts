import type { Plugin } from "vite";

export interface FreshConfig {
}

export function fresh(): Plugin[] {
  const islandSpecifiers = new Set<string>();

  return [
    {
      name: "fresh",
    },
    wrapIslandsPlugin({ specifiers: islandSpecifiers }),
    fsRoutesPlugin(),
    buildIdPlugin(),
  ];
}

const ISLAND_FILE = /(\/\(_islands\)\/|\.(client|island)\.[tj]sx?$)/;

function wrapIslandsPlugin(options: { specifiers: Set<string> }): Plugin {
  return {
    name: "fresh:islands",
    applyToEnvironment(env) {
      return env.name === "ssr";
    },
    transform(code, id) {
      if (!options.specifiers.has(id) && !ISLAND_FILE.test(id)) {
        return;
      }
    },
  };
}

function fsRoutesPlugin(): Plugin {
  const modName = `fresh:fs_routes`;

  return {
    name: "fresh:fs_routes",
    applyToEnvironment(env) {
      return env.name === "ssr";
    },
    resolveId(id) {
      if (id === modName) {
        return `\0${modName}`;
      }
    },
    load(id) {
      if (id !== `\0${modName}`) return;
    },
  };
}

function buildIdPlugin(): Plugin {
  const modName = `fresh:build_id`;

  return {
    name: "fresh:build_id",
    resolveId(id) {
      if (id === modName) {
        return `\0${modName}`;
      }
    },
    load(id) {
      if (id !== `\0${modName}`) return;

      // FIXME: Use real version
      return `export default ${JSON.stringify(Math.random())}`;
    },
  };
}

"use strict";

const uniqBy = require("lodash/uniqBy");
const partition = require("lodash/partition");
const flatten = require("lodash/flatten");
const fs = require("fs");
const path = require("path");
const resolve = require("resolve");
const thirdParty = require("./third-party");
const internalPlugins = require("./internal-plugins");

function loadPlugins(plugins, pluginSearchDirs) {
  if (!plugins) {
    plugins = [];
  }

  if (!pluginSearchDirs) {
    pluginSearchDirs = [];
  }
  // unless pluginSearchDirs are provided, auto-load plugins from node_modules that are parent to Prettier
  if (!pluginSearchDirs.length) {
    const autoLoadDir = thirdParty.findParentDir(__dirname, "node_modules");
    if (autoLoadDir) {
      pluginSearchDirs = [autoLoadDir];
    }
  }

  const [externalPluginNames, externalPluginInstances] = partition(
    plugins,
    plugin => typeof plugin === "string"
  );

  const externalManualLoadPluginInfos = externalPluginNames.map(pluginName => {
    let requirePath;
    try {
      // try local files
      requirePath = resolve.sync(path.resolve(process.cwd(), pluginName));
    } catch (e) {
      // try node modules
      requirePath = resolve.sync(pluginName, { basedir: process.cwd() });
    }
    return {
      name: pluginName,
      requirePath
    };
  });

  const externalAutoLoadPluginInfos = pluginSearchDirs
    .map(pluginSearchDir => {
      const resolvedPluginSearchDir = path.resolve(
        process.cwd(),
        pluginSearchDir
      );

      const nodeModulesDir = path.resolve(
        resolvedPluginSearchDir,
        "node_modules"
      );

      // In some fringe cases (ex: files "mounted" as virtual directories), the
      // isDirectory(resolvedPluginSearchDir) check might be false even though
      // the node_modules actually exists.
      if (
        !isDirectory(nodeModulesDir) &&
        !isDirectory(resolvedPluginSearchDir)
      ) {
        throw new Error(
          `${pluginSearchDir} does not exist or is not a directory`
        );
      }

      return findPluginsInNodeModules(nodeModulesDir).map(dir => ({
        name: path.basename(dir),
        requirePath: dir
      }));
    })
    .reduce((a, b) => a.concat(b), []);

  const externalPlugins = uniqBy(
    externalManualLoadPluginInfos.concat(externalAutoLoadPluginInfos),
    "requirePath"
  )
    .map(externalPluginInfo => ({
      name: externalPluginInfo.name,
      ...eval("require")(externalPluginInfo.requirePath)
    }))
    .concat(externalPluginInstances);

  return internalPlugins.concat(externalPlugins);
}

function findPluginsInNodeModules(nodeModulesDir) {
  const root = readDirs(nodeModulesDir);

  const rootPlugins = root
    .filter(name => name.startsWith("prettier-plugin-"))
    .map(name => path.join(nodeModulesDir, name));

  // `@prettier/prettier-plugin-*/package.json` will handle with other socped dirs
  let prettierScopedPlugins = [];
  if (root.some(name => name === "@prettier")) {
    const dir = path.join(nodeModulesDir, "@prettier");
    const dirs = readDirs(dir);
    prettierScopedPlugins = dirs
      .filter(name => name.startsWith("plugin-"))
      .map(name => path.join(dir, name));
  }

  const scopedPlugins = flatten(
    root
      .filter(name => name[0] === "@")
      .map(name => {
        const dir = path.join(nodeModulesDir, name);
        return readDirs(dir)
          .filter(name => name.startsWith("prettier-plugin-"))
          .map(name => path.join(dir, name));
      })
  );

  return [...rootPlugins, ...prettierScopedPlugins, ...scopedPlugins];
}

function readDirs(dir) {
  if (!isDirectory(dir)) {
    return [];
  }

  return fs.readdirSync(dir);
}

function isDirectory(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (e) {
    return false;
  }
}
module.exports = loadPlugins;

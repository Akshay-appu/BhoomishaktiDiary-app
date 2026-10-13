// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite's web runtime loads its SQLite engine as a .wasm file
// (node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.wasm); without this,
// Metro can't resolve that import and the web worker never starts, so
// every SQLite call on web hangs forever instead of resolving or rejecting.
config.resolver.assetExts.push('wasm');

module.exports = config;

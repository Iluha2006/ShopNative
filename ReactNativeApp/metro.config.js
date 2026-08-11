const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.maxWorkers = 1;

const fixedAssetUris = path.join(__dirname, 'expo-asset-uris-fixed.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath || '';
  if (
    moduleName === 'expo-asset/build/AssetUris' ||
    (moduleName === './AssetUris' && origin.includes(path.join('expo-asset', 'build')))
  ) {
    return {
      type: 'sourceFile',
      filePath: fixedAssetUris,
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

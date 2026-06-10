const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withIosLanguageFix(config) {
  if (!config.ios) config.ios = {};
  // Forzamos de forma imperativa que el lenguaje base del AppDelegate sea Objective-C
  config.ios.appDelegateLanguage = 'objc';

  return withDangerousMod(config, [
    'ios',
    async (config) => {
      // Este bloque intercepta la generación nativa justo antes de que los
      // plugins "dangerous" de Firebase inspeccionen los archivos de iOS
      return config;
    },
  ]);
};
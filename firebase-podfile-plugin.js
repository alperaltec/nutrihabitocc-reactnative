const { withPodfile } = require('@expo/config-plugins');

module.exports = function withFirebaseModularHeaders(config) {
  return withPodfile(config, (config) => {
    // Definimos la regla estricta para los paquetes de Firebase y Google
    const modularHeadersRule = `
# Inyección manual para solucionar el conflicto de Firebase estático en Nueva Arquitectura
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
`;

    // Si la regla no existe en el Podfile, la inyectamos justo arriba del bloque principal
    if (!config.modResults.contents.includes("pod 'FirebaseCoreInternal'")) {
      config.modResults.contents = modularHeadersRule + config.modResults.contents;
    }

    return config;
  });
};
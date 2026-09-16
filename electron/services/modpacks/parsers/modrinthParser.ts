import type {
  ModrinthManifest,
  ModpackManifest,
} from '../../../../shared/types/modpack';

const loaderKeys = ['forge', 'fabric-loader', 'quilt-loader', 'neoforge'] as const;

/**
 * Парсинг Modrinth манифеста (modrinth.index.json)
 */
export function parseModrinthManifest(manifestJson: string): ModpackManifest {
  let parsed: ModrinthManifest;
  
  try {
    parsed = JSON.parse(manifestJson);
  } catch (error) {
    throw new Error(`Failed to parse Modrinth manifest JSON: ${error}`);
  }

  // Валидация структуры
  if (!parsed.formatVersion) {
    throw new Error('Modrinth manifest missing formatVersion');
  }
  
  if (parsed.game !== 'minecraft') {
    throw new Error(`Invalid game: expected "minecraft", got "${parsed.game}"`);
  }
  
  if (!parsed.name) {
    throw new Error('Modrinth manifest missing name');
  }
  
  if (!Array.isArray(parsed.files)) {
    throw new Error('Modrinth manifest files must be an array');
  }

  const dependencies = parsed.dependencies ?? {};
  const minecraftVersion = dependencies.minecraft;
  if (typeof minecraftVersion !== 'string' || !minecraftVersion) throw new Error('Modrinth manifest missing dependencies.minecraft');
  const loader = loaderKeys.find((key) => dependencies[key]);

  const manifest: ModpackManifest = {
    formatVersion: parsed.formatVersion,
    minecraft: {
      version: minecraftVersion,
      modLoaders: loader ? [{ id: `${loader === 'fabric-loader' ? 'fabric' : loader === 'quilt-loader' ? 'quilt' : loader}-${dependencies[loader]}`, primary: true }] : [],
    },
    name: parsed.name,
    version: parsed.versionId || '1.0.0',
    author: undefined,
    files: parsed.files.map((file) => {
      // Валидация пути для безопасности
      if (file.path.includes('..') || file.path.startsWith('/') || file.path.startsWith('\\')) {
        throw new Error(`Invalid file path in Modrinth manifest: ${file.path}`);
      }
      
      // Проверка на абсолютные пути (Windows)
      if (/^[A-Za-z]:/.test(file.path)) {
        throw new Error(`Invalid file path in Modrinth manifest (absolute path): ${file.path}`);
      }
      
      return {
        path: file.path,
        hashes: file.hashes,
        downloads: file.downloads,
        fileSize: file.fileSize,
        required: file.env?.client === 'required' || file.env?.client === undefined,
        env: file.env,
      };
    }),
    overrides: 'overrides',
  };

  return manifest;
}

/**
 * Валидация Modrinth манифеста
 */
export function validateModrinthManifest(manifest: ModrinthManifest): boolean {
  try {
    if (!manifest.formatVersion || manifest.formatVersion !== 1) {
      return false;
    }
    
    if (manifest.game !== 'minecraft') {
      return false;
    }
    
    if (!manifest.name) {
      return false;
    }
    
    if (!Array.isArray(manifest.files)) {
      return false;
    }
    if (!manifest.dependencies?.minecraft || typeof manifest.dependencies.minecraft !== 'string') {
      return false;
    }
    
    // Валидация файлов
    for (const file of manifest.files) {
      if (!file.path) {
        return false;
      }
      
      // Проверка безопасности пути
      if (file.path.includes('..') || file.path.startsWith('/') || file.path.startsWith('\\')) {
        return false;
      }
      
      // Проверка на абсолютные пути (Windows)
      if (/^[A-Za-z]:/.test(file.path)) {
        return false;
      }
      
      if (!file.hashes || !file.hashes.sha1 || !file.hashes.sha512) {
        return false;
      }
      
      if (!Array.isArray(file.downloads) || file.downloads.length === 0) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

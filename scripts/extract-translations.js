const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Escape/unescape functions for dots in keys
function escapeDotKey(key) {
  return key.replace(/\./g, '__DOT__');
}

function unescapeDotKey(key) {
  return key.replace(/__DOT__/g, '.');
}

// Fonction pour extraire les clés de traduction d'un fichier
function extractTranslationKeysFromFile(filePath) {
  const keys = [];
  const fileContent = fs.readFileSync(filePath, 'utf8');

  try {
    const ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
    });

    traverse(ast, {
      CallExpression(path) {
        const { callee, arguments: args } = path.node;

        if (
          (callee.type === 'Identifier' && callee.name === 't') ||
          (callee.type === 'MemberExpression' && callee.property.name === 't')
        ) {
          if (args.length > 0 && args[0].type === 'StringLiteral') {
            keys.push(args[0].value);
          }
        }
      },
    });
  } catch (error) {
    console.error(`Erreur lors de l'analyse du fichier ${filePath}:`, error);
  }

  return keys;
}

// Fonction principale
async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node extract-translations.js <output-file.json>');
    process.exit(1);
  }

  const outputFile = process.argv[2];
  const projectDir = process.cwd();
  const i18nDir = path.join(projectDir, 'i18n');

  if (!fs.existsSync(i18nDir)) {
    fs.mkdirSync(i18nDir, { recursive: true });
  }

  const files = glob.sync('**/*.{js,jsx,ts,tsx}', {
    cwd: projectDir,
    ignore: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'storybook-static/**',
      'public/**',
    ],
  });

  let allKeys = [];

  for (const file of files) {
    const filePath = path.join(projectDir, file);
    const keys = extractTranslationKeysFromFile(filePath);
    allKeys = [...allKeys, ...keys];
    if (keys.length > 0) {
      console.log(`Trouvé ${keys.length} clés dans ${file}`);
    }
  }

  allKeys = [...new Set(allKeys)];
  console.log(`Total: ${allKeys.length} clés uniques trouvées`);

  // Apply escapeDotKey to all extracted keys
  const translationObject = {};
  allKeys.forEach(key => {
    const escapedKey = escapeDotKey(key);
    translationObject[escapedKey] = '';
  });

  const outputPath = path.join(i18nDir, outputFile);
  let existingTranslations = {};

  if (fs.existsSync(outputPath)) {
    try {
      existingTranslations = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Le fichier ${outputFile} existe déjà, fusion des clés...`);
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier ${outputFile}:`, error);
    }
  }

  // Escape existing keys to match the escaped new keys
  const escapedExistingTranslations = {};
  Object.keys(existingTranslations).forEach(key => {
    const escapedKey = escapeDotKey(unescapeDotKey(key));
    escapedExistingTranslations[escapedKey] = existingTranslations[key];
  });

  // Merge: preserve old translations, add new keys with empty string
  Object.keys(translationObject).forEach(key => {
    if (escapedExistingTranslations[key]) {
      translationObject[key] = escapedExistingTranslations[key];
    }
  });

  const mergedTranslations = { ...translationObject, ...escapedExistingTranslations };

  // Separate keys: empty values vs non-empty, dots vs non-dots
  const nonEmptyWithoutDot = [];
  const nonEmptyWithDot = [];
  const emptyKeys = [];

  Object.entries(mergedTranslations).forEach(([key, value]) => {
    if (value === '') {
      emptyKeys.push([key, value]);
    } else if (key.includes('__DOT__')) {
      nonEmptyWithDot.push([key, value]);
    } else {
      nonEmptyWithoutDot.push([key, value]);
    }
  });

  // Rebuild sorted object: non-empty without dot, non-empty with dot, empty at bottom
  const sortedMergedTranslations = {};
  [...nonEmptyWithoutDot.sort(), ...nonEmptyWithDot.sort(), ...emptyKeys.sort()].forEach(
    ([key, value]) => {
      sortedMergedTranslations[key] = value;
    }
  );

  fs.writeFileSync(outputPath, JSON.stringify(sortedMergedTranslations, null, 2));
  console.log(`Les clés de traduction ont été écrites dans ${outputPath}`);
}

main().catch(error => {
  console.error('Une erreur est survenue:', error);
  process.exit(1);
});

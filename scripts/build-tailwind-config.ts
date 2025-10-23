//This script dynamically reads and exports the Tailwind CSS theme from  tailwind.config.ts file into a JSON file that the app can use at runtime.
import fs from 'fs';
import path from 'path';

(async () => {
  //Resolves the absolute path to your tailwind.config.ts file based on the current directory (__dirname).
  const configPath = path.resolve(__dirname, '../tailwind.config.ts');
  //Dynamically imports the Tailwind config file as a module.
  const tailwindConfigModule = await import(configPath);
  //Accesses the default export from the Tailwind config file (which is how most Tailwind configs are structured).
  const tailwindConfig = tailwindConfigModule.default;
  //Extracts the theme section from the Tailwind config.
  const theme = tailwindConfig.theme || {};
  //Writes the extracted theme object as a pretty-printed JSON file (2-space indentation).
  fs.writeFileSync(
    path.resolve(__dirname, '../src/lib/fullTailwindConfig.json'),
    //2: This is the number of spaces used for indentation in the output.
    JSON.stringify(theme, null, 2)
  );

  console.log('Tailwind theme exported to fullTailwindConfig.json');
})();

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Définir les types pour les langues disponibles et par défaut
type AvailableLocale = 'en' | 'fr' | 'es';
const AVAILABLE_LANGUAGES: AvailableLocale[] = ['en', 'fr', 'es'];
const DEFAULT_LANGUAGE: AvailableLocale = 'en';

// Type pour les messages
interface Messages {
  [key: string]: string | Messages;
}

export default getRequestConfig(async () => {
  // Essayer de lire depuis les cookies
  const cookieStore = cookies();
  let locale = (await cookieStore).get('NEXT_LOCALE')?.value as AvailableLocale | undefined;

  // Vérifier si la langue est disponible
  if (!locale || !AVAILABLE_LANGUAGES.includes(locale)) {
    locale = DEFAULT_LANGUAGE;
  }

  // Charger les messages avec gestion d'erreurs
  let messages: Messages;
  try {
    messages = (await import(`./${locale}.json`)).default;
  } catch {
    // Essayer de charger les messages pour la langue par défaut
    try {
      messages = (await import(`./${DEFAULT_LANGUAGE}.json`)).default;
      locale = DEFAULT_LANGUAGE; // Ajuster la locale si le fichier original n'existe pas
    } catch {
      messages = { error: 'Translation files could not be loaded' };
    }
  }

  return {
    locale,
    messages,
  };
});

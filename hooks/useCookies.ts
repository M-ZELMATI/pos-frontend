// cookies.ts
export type NextCookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | "none" | "lax" | "strict";
};

// ---- Set Cookie ----
export function setCookie<T>(
  key: string,
  value: T,
  options?: NextCookieOptions,
): void {
  try {
    const serializedValue = JSON.stringify(value);
    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(serializedValue)}`;

    if (options) {
      if (options.expires)
        cookieString += `; expires=${options.expires.toUTCString()}`;
      if (options.maxAge !== undefined)
        cookieString += `; max-age=${options.maxAge}`;
      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.secure) cookieString += `; secure`;
      if (options.sameSite) {
        if (typeof options.sameSite === "boolean") {
          cookieString += options.sameSite ? "; SameSite=Strict" : "";
        } else {
          cookieString += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
        }
      }
    }

    document.cookie = cookieString;
  } catch (error) {
    console.error(`Erreur lors de la définition du cookie (${key}):`, error);
  }
}

// ---- Get Cookie ----
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

// ---- Update Cookie ----
export function updateCookie<T>(
  key: string,
  updater: T | ((oldValue: T | undefined) => T),
  options?: NextCookieOptions,
): void {
  try {
    const currentValue = getCookie(key);
    const newValue =
      updater instanceof Function ? updater(currentValue as T) : updater;
    setCookie(key, newValue, options);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du cookie (${key}):`, error);
  }
}

// ---- Remove Cookie ----
export function removeCookie(
  key: string,
  options?: Omit<NextCookieOptions, "maxAge" | "expires">,
): void {
  try {
    let cookieString = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (options) {
      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.secure) cookieString += "; secure";
      if (options.sameSite) {
        if (typeof options.sameSite === "boolean") {
          cookieString += options.sameSite ? "; SameSite=Strict" : "";
        } else {
          cookieString += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
        }
      }
    }

    document.cookie = cookieString;
  } catch (error) {
    console.error(`Erreur lors de la suppression du cookie (${key}):`, error);
  }
}

// ---- Has Cookie ----
export function hasCookie(key: string): boolean {
  try {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith(`${encodeURIComponent(key)}=`));
  } catch (error) {
    console.error(`Erreur lors de la vérification du cookie (${key}):`, error);
    return false;
  }
}

// ---- Get All Cookies ----
export function getAllCookies(): Record<string, unknown> {
  try {
    const parsedCookies: Record<string, unknown> = {};

    document.cookie.split("; ").forEach((cookie) => {
      if (cookie) {
        const parts = cookie.split("=");
        if (parts.length >= 2) {
          const key = decodeURIComponent(parts[0]);
          const value = decodeURIComponent(parts.slice(1).join("="));
          try {
            parsedCookies[key] = JSON.parse(value);
          } catch {
            parsedCookies[key] = value;
          }
        }
      }
    });

    return parsedCookies;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les cookies:", error);
    return {};
  }
}

// ---- Get All Cookie Keys ----
export function getAllCookieKeys(): string[] {
  return Object.keys(getAllCookies());
}

// ---- Set Batch Cookies ----
export function setBatchCookies<T>(
  cookies: Record<string, T>,
  options?: NextCookieOptions,
): void {
  Object.entries(cookies).forEach(([key, value]) => {
    setCookie(key, value, options);
  });
}

// ---- Remove Batch Cookies ----
export function removeBatchCookies(
  keys: string[],
  options?: Omit<NextCookieOptions, "maxAge" | "expires">,
): void {
  keys.forEach((key) => {
    removeCookie(key, options);
  });
}

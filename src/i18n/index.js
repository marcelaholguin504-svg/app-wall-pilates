import { es } from "./es.js";

const dictionaries = { es };
const currentLocale = "es";

export function t(path) {
  const parts = path.split(".");
  let value = dictionaries[currentLocale];
  for (const part of parts) {
    value = value?.[part];
  }
  return value ?? path;
}

export const locale = currentLocale;

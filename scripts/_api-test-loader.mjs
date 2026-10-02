// Loader mínimo para poder importar los archivos reales de /api (que usan
// ".js" en sus imports relativos a propósito, como lo requiere el build de
// Vercel/esbuild) directamente con Node, redirigiendo esos imports a su
// archivo .ts real cuando el .js no existe. Solo para pruebas locales —
// Vercel no necesita esto, esbuild ya resuelve ese caso solo.

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith(".js") && context.parentURL && context.parentURL.includes("/api/")) {
    const tsSpecifier = specifier.slice(0, -3) + ".ts";
    try {
      const resolved = await nextResolve(tsSpecifier, context);
      return resolved;
    } catch {
      // Si de verdad no existe el .ts tampoco, sigue el camino normal.
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}

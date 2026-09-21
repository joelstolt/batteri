// The Next.js data modules use extensionless relative imports. Resolve those for
// Node without changing application modules or adding a build dependency.
export async function resolve(specifier, context, nextResolve) {
  if (/^\.\.?\//.test(specifier) && !/\.[a-z]+$/i.test(specifier)) {
    return nextResolve(`${specifier}.js`, context)
  }
  return nextResolve(specifier, context)
}

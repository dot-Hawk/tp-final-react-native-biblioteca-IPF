/** Los parámetros de ruta pueden llegar repetidos (?q=a&q=b) o faltar. */
export function primerValor(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

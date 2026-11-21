const PATRON_ISBN = /^\d{13}$/;

export function esIsbnValido(valor: string): boolean {
  return PATRON_ISBN.test(valor);
}

/** Normaliza lo que la persona escribe a mano: sin espacios ni guiones. */
export function limpiarIsbn(valor: string): string {
  return valor.replace(/[\s-]/g, '');
}

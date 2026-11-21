import { describe, expect, it } from '@jest/globals';

import { esIsbnValido, limpiarIsbn } from '../isbn';

describe('esIsbnValido', () => {
  it('acepta 13 dígitos', () => {
    expect(esIsbnValido('9789500441001')).toBe(true);
  });

  it('rechaza menos o más de 13 dígitos', () => {
    expect(esIsbnValido('123')).toBe(false);
    expect(esIsbnValido('97895004410011')).toBe(false);
  });

  it('rechaza letras y guiones', () => {
    expect(esIsbnValido('abc')).toBe(false);
    expect(esIsbnValido('978-950-04-4100-1')).toBe(false);
  });
});

describe('limpiarIsbn', () => {
  it('quita guiones y espacios de lo que se escribe a mano', () => {
    expect(limpiarIsbn(' 978-950-04 4100-1 ')).toBe('9789500441001');
  });
});

import { describe, expect, it } from '@jest/globals';

import { formatearFecha, sumarDias } from '../fechas';

describe('sumarDias', () => {
  it('suma días completos en milisegundos', () => {
    const base = new Date(2026, 0, 1).getTime();
    expect(new Date(sumarDias(base, 7)).getDate()).toBe(8);
  });
});

describe('formatearFecha', () => {
  it('muestra día, mes y año en formato argentino', () => {
    expect(formatearFecha(new Date(2026, 2, 5).getTime())).toBe('05/03/2026');
  });
});

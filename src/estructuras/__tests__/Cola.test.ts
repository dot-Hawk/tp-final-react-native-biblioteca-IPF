import { describe, expect, it } from '@jest/globals';

import { Cola } from '../Cola';

describe('Cola', () => {
  it('empieza vacía', () => {
    const cola = new Cola<string>();
    expect(cola.tamanio).toBe(0);
    expect(cola.estaVacia()).toBe(true);
    expect(cola.verFrente()).toBeUndefined();
  });

  it('respeta el orden de llegada', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');
    cola.encolar('Luis');
    cola.encolar('Sofía');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.desencolar()).toBe('Luis');
    expect(cola.verFrente()).toBe('Sofía');
  });

  it('desencolar una cola vacía devuelve undefined sin romper', () => {
    const cola = new Cola<string>();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
  });

  it('se puede volver a usar después de vaciarse', () => {
    const cola = new Cola<number>([1]);
    cola.desencolar();
    expect(cola.estaVacia()).toBe(true);
    cola.encolar(2);
    expect(cola.verFrente()).toBe(2);
    expect(cola.tamanio).toBe(1);
  });

  it('mantiene el tamaño correcto con muchas operaciones intercaladas', () => {
    const cola = new Cola<number>();
    for (let i = 0; i < 100; i++) cola.encolar(i);
    for (let i = 0; i < 60; i++) cola.desencolar();
    expect(cola.tamanio).toBe(40);
    expect(cola.verFrente()).toBe(60);
    expect(cola.aArray()[0]).toBe(60);
  });

  it('posicion devuelve el lugar desde 1, o 0 si no está', () => {
    const cola = new Cola<string>(['Ana', 'Luis']);
    expect(cola.posicion('Luis')).toBe(2);
    expect(cola.posicion('Pedro')).toBe(0);
  });

  it('aArray devuelve una copia del frente al final', () => {
    const cola = new Cola<string>(['Ana', 'Luis']);
    cola.desencolar();
    const copia = cola.aArray();
    copia.push('X');
    expect(cola.aArray()).toEqual(['Luis']);
  });
});

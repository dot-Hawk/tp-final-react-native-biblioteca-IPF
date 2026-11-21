import { describe, expect, it } from '@jest/globals';

import { Pila } from '../Pila';

describe('Pila', () => {
  it('empieza vacía', () => {
    const pila = new Pila<number>();
    expect(pila.tamanio).toBe(0);
    expect(pila.estaVacia()).toBe(true);
    expect(pila.verTope()).toBeUndefined();
  });

  it('apila y devuelve el último elemento en el tope', () => {
    const pila = new Pila<string>();
    pila.apilar('a');
    pila.apilar('b');
    expect(pila.verTope()).toBe('b');
    expect(pila.tamanio).toBe(2);
  });

  it('desapila en orden inverso al de entrada', () => {
    const pila = new Pila<number>([1, 2, 3]);
    expect(pila.desapilar()).toBe(3);
    expect(pila.desapilar()).toBe(2);
    expect(pila.tamanio).toBe(1);
  });

  it('desapilar una pila vacía devuelve undefined sin romper', () => {
    const pila = new Pila<number>();
    expect(pila.desapilar()).toBeUndefined();
    expect(pila.tamanio).toBe(0);
  });

  it('aArray devuelve una copia de base a tope', () => {
    const pila = new Pila<number>([1, 2]);
    const copia = pila.aArray();
    copia.push(99);
    expect(pila.aArray()).toEqual([1, 2]);
  });

  it('no comparte estado con el array recibido en el constructor', () => {
    const origen = [1, 2];
    const pila = new Pila<number>(origen);
    origen.push(3);
    expect(pila.tamanio).toBe(2);
  });
});

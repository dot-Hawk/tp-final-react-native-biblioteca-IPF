/**
 * Pila LIFO. Se usa para "Vistos recientemente": el último libro abierto
 * queda en el tope.
 */
export class Pila<T> {
  #items: T[];

  constructor(iniciales: T[] = []) {
    this.#items = [...iniciales];
  }

  apilar(elemento: T): void {
    this.#items.push(elemento);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  verTope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  /** Copia de base a tope. */
  aArray(): T[] {
    return [...this.#items];
  }
}

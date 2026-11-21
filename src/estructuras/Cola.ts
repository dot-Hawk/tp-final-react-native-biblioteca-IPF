/**
 * Cola FIFO sin shift(): se guarda el índice del frente para que
 * desencolar sea O(1). Cuando la parte ya consumida crece, se compacta.
 */
export class Cola<T> {
  #items: T[];
  #frente = 0;

  constructor(iniciales: T[] = []) {
    this.#items = [...iniciales];
  }

  encolar(elemento: T): void {
    this.#items.push(elemento);
  }

  desencolar(): T | undefined {
    if (this.estaVacia()) return undefined;

    const elemento = this.#items[this.#frente];
    this.#frente++;

    if (this.#frente > 32 && this.#frente * 2 > this.#items.length) {
      this.#items = this.#items.slice(this.#frente);
      this.#frente = 0;
    }
    return elemento;
  }

  verFrente(): T | undefined {
    return this.estaVacia() ? undefined : this.#items[this.#frente];
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  /** Lugar en la cola empezando en 1; 0 si el elemento no está. */
  posicion(elemento: T): number {
    return this.aArray().indexOf(elemento) + 1;
  }

  get tamanio(): number {
    return this.#items.length - this.#frente;
  }

  /** Copia del frente al final. */
  aArray(): T[] {
    return this.#items.slice(this.#frente);
  }
}

import type { Libro } from '../types';

// Los dos primeros son libros reales que tengo en casa para probar el escáner:
// reemplazar isbn/titulo/autor/anio por los del ejemplar físico.
export const LIBROS: Libro[] = [
  { isbn: '9789500441001', titulo: 'Ficciones', autor: 'Jorge Luis Borges', anio: 1944, ejemplares: 2 },
  { isbn: '9789875661004', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, ejemplares: 1 },
  { isbn: '9789507311000', titulo: 'El Aleph', autor: 'Jorge Luis Borges', anio: 1949, ejemplares: 0 },
  { isbn: '9788497591003', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, ejemplares: 3 },
  { isbn: '9789504921004', titulo: 'El túnel', autor: 'Ernesto Sabato', anio: 1948, ejemplares: 0 },
  { isbn: '9789877381009', titulo: 'Martín Fierro', autor: 'José Hernández', anio: 1872, ejemplares: 4 },
  { isbn: '9789505111008', titulo: 'Bestiario', autor: 'Julio Cortázar', anio: 1951, ejemplares: 1 },
  { isbn: '9788437601007', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, ejemplares: 2 },
  { isbn: '9789875801004', titulo: 'Las venas abiertas de América Latina', autor: 'Eduardo Galeano', anio: 1971, ejemplares: 1 },
  { isbn: '9789500461009', titulo: 'Don Segundo Sombra', autor: 'Ricardo Güiraldes', anio: 1926, ejemplares: 0 },
  { isbn: '9789500711012', titulo: 'Facundo', autor: 'Domingo F. Sarmiento', anio: 1845, ejemplares: 2 },
  { isbn: '9789871181018', titulo: 'Clean Code', autor: 'Robert C. Martin', anio: 2008, ejemplares: 1 },
  { isbn: '9789507241017', titulo: 'Estructuras de datos y algoritmos', autor: 'Alfred V. Aho', anio: 1983, ejemplares: 3 },
  { isbn: '9788445061015', titulo: 'El señor de los anillos', autor: 'J. R. R. Tolkien', anio: 1954, ejemplares: 1 },
  { isbn: '9788499081014', titulo: 'Los siete locos', autor: 'Roberto Arlt', anio: 1929, ejemplares: 2 },
];

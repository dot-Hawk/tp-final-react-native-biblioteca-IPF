export const colores = {
  fondo: '#F6F4EF',
  superficie: '#FFFFFF',
  borde: '#DDD8CE',
  texto: '#1F2328',
  textoSecundario: '#5C6168',
  primario: '#2F4A3A',
  primarioTexto: '#FFFFFF',
  peligro: '#9B2C2C',
  peligroFondo: '#F6E3E1',
  aviso: '#7A5A12',
  avisoFondo: '#F5EBCF',
  exito: '#2F5D3A',
  exitoFondo: '#E3EDE2',
  deshabilitado: '#A9ADB3',
} as const;

export const espacio = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const tipografia = {
  chica: 13,
  normal: 15,
  media: 17,
  titulo: 20,
  grande: 24,
} as const;

export const radio = {
  s: 4,
  m: 8,
} as const;

/** Área táctil mínima recomendada (44 x 44). */
export const TAMANIO_TACTIL = 44;

export const TAMANIO_ICONO = 22;

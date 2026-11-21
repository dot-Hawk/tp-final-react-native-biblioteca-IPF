import { MS_POR_DIA } from '../constants/biblioteca';

export function sumarDias(desde: number, dias: number): number {
  return desde + dias * MS_POR_DIA;
}

function dosDigitos(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatearFecha(epoch: number): string {
  const fecha = new Date(epoch);
  return `${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
}

// Tabla de precios en USD. Fuente: docs/precios.md
// Cada fila es [horas, foto, video, fotoVideo].
const TABLA = [
  [1, 550, 850, 1250],
  [2, 650, 1050, 1450],
  [3, 700, 1250, 1650],
  [4, 750, 1450, 1850],
  [5, 800, 1650, 2050],
  [6, 850, 1850, 2250],
  [7, 900, 2050, 2450],
  [8, 950, 2250, 2650],
  [9, 1150, 2450, 2850],
  [10, 1250, 2650, 3050],
  [11, 1350, 2850, 3250],
  [12, 1450, 3250, 3650]
]

export const SERVICIOS = {
  foto: { nombre: 'Foto', columna: 1, incluyeFotos: true },
  video: { nombre: 'Video', columna: 2, incluyeFotos: false },
  fotoVideo: { nombre: 'Foto + Video', columna: 3, incluyeFotos: true }
}

export const PAQUETES = [
  { id: 'h1', horas: 1, titulo: '1 hora', etiqueta: 'Íntimo' },
  { id: 'h8', horas: 8, titulo: '8 horas', etiqueta: 'El más elegido' },
  { id: 'h12', horas: 12, titulo: '12 horas', etiqueta: 'El más completo' },
  { id: 'custom', horas: null, titulo: 'Personalizado', etiqueta: 'A tu medida' }
]

export const HORAS_MIN = 1
export const HORAS_MAX = 12
export const FOTOS_POR_HORA = 50
export const FOTOS_PASO = 10
export const PRECIO_PASO = 50
export const FOTOS_EXTRA_MAX = 30

export const DESDE = TABLA[0][1]

export function fotosIncluidas(servicio, horas) {
  return SERVICIOS[servicio].incluyeFotos ? horas * FOTOS_POR_HORA : 0
}

// Calcula el total. "extra" es la cantidad de fotos adicionales (múltiplo de 10).
export function cotizar(servicio, horas, extra = 0) {
  const fila = TABLA[horas - 1]
  const base = fila[SERVICIOS[servicio].columna]
  const fotosExtra = SERVICIOS[servicio].incluyeFotos ? extra : 0
  return {
    base,
    fotos: fotosIncluidas(servicio, horas) + fotosExtra,
    total: base + (fotosExtra / FOTOS_PASO) * PRECIO_PASO
  }
}

export const dinero = (n) => '$' + Math.round(n).toLocaleString('en-US')

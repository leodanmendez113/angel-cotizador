// Precios del cotizador en USD.
// Los precios vigentes los maneja el admin y viven en el VPS (/datos/precios-eventos.json).
// Esta copia se usa si ese archivo no se puede leer (sin señal, en desarrollo o en GitHub Pages).
// Cada fila de la tabla es [horas, foto, video, fotoVideo].
const RESPALDO = {
  tabla: [
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
  ],
  fotosPorHora: 50,
  fotosPaso: 10,
  precioPaso: 50,
  fotosExtraMax: 30
}

// Precios en uso. cargarPrecios() los reemplaza por los del admin.
export const PRECIOS = structuredClone(RESPALDO)

export async function cargarPrecios() {
  try {
    const r = await fetch('/datos/precios-eventos.json', { cache: 'no-cache' })
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) return
    const datos = await r.json()
    if (Array.isArray(datos.tabla) && datos.tabla.length === 12) Object.assign(PRECIOS, datos)
  } catch {}
}

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

export const desde = () => PRECIOS.tabla[0][1]

export function fotosIncluidas(servicio, horas) {
  return SERVICIOS[servicio].incluyeFotos ? horas * PRECIOS.fotosPorHora : 0
}

// Calcula el total. "extra" es la cantidad de fotos adicionales (múltiplo de fotosPaso).
export function cotizar(servicio, horas, extra = 0) {
  const base = PRECIOS.tabla[horas - 1][SERVICIOS[servicio].columna]
  const fotosExtra = SERVICIOS[servicio].incluyeFotos ? extra : 0
  return {
    base,
    fotos: fotosIncluidas(servicio, horas) + fotosExtra,
    total: base + (fotosExtra / PRECIOS.fotosPaso) * PRECIOS.precioPaso
  }
}

export const dinero = (n) => '$' + Math.round(n).toLocaleString('en-US')

import './styles/base.css'
import './styles/cotizador.css'
import { iniciarCotizador } from './cotizador.js'
import { iniciarMotion } from './motion.js'
import { cargarPrecios, desde, dinero } from './precios.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
iniciarMotion()
// Los precios del admin llegan en milisegundos; mientras tanto se ven los de respaldo.
cargarPrecios().then(() => {
  document.querySelector('[data-desde]').textContent = dinero(desde())
  iniciarCotizador()
})

import './styles/base.css'
import './styles/cotizador.css'
import { iniciarCotizador } from './cotizador.js'
import { iniciarMotion } from './motion.js'
import { cargarPrecios, desde, dinero } from './precios.js'
import { cargarContacto, aplicarContacto } from './contacto.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
iniciarMotion()
// Precios y contacto del admin llegan en milisegundos; mientras tanto se ven los de respaldo.
Promise.all([cargarPrecios(), cargarContacto()]).then(() => {
  aplicarContacto()
  document.querySelector('[data-desde]').textContent = dinero(desde())
  iniciarCotizador()
})

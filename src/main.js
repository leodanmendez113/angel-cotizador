import './styles/base.css'
import './styles/cotizador.css'
import { iniciarCotizador } from './cotizador.js'
import { iniciarMotion } from './motion.js'
import { DESDE, dinero } from './precios.js'

document.querySelector('[data-anio]').textContent = new Date().getFullYear()
document.querySelector('[data-desde]').textContent = dinero(DESDE)

iniciarCotizador()
iniciarMotion()

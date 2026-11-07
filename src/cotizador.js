import { gsap } from 'gsap'
import { SERVICIOS, PAQUETES, PRECIOS, cotizar, fotosIncluidas, dinero } from './precios.js'
import { WHATSAPP } from './config.js'

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]

const estado = { servicio: 'foto', paquete: 'h8', horas: 8, extra: 0 }
const contador = { valor: 0 }
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches

// Botones tipo "radio" accesibles: flechas izquierda/derecha cambian la opción.
function grupoRadio(contenedor, opciones, alElegir) {
  contenedor.innerHTML = opciones
    .map((o) => `<button type="button" role="radio" data-valor="${o.valor}">${o.html}</button>`)
    .join('')
  const botones = [...contenedor.children]
  botones.forEach((b, i) => {
    b.addEventListener('click', () => alElegir(b.dataset.valor))
    b.addEventListener('keydown', (e) => {
      const paso = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (!paso) return
      e.preventDefault()
      const sig = botones[(i + paso + botones.length) % botones.length]
      sig.focus()
      alElegir(sig.dataset.valor)
    })
  })
  return (activo) => botones.forEach((b) => {
    const on = b.dataset.valor === activo
    b.setAttribute('aria-checked', on)
    b.tabIndex = on ? 0 : -1
  })
}

function mensajeWhatsApp(c) {
  const s = SERVICIOS[estado.servicio].nombre
  const lineas = [
    'Hola Ángel, quiero reservar mi fecha 💍',
    '',
    `• Cobertura: ${s}`,
    `• Duración: ${estado.horas} ${estado.horas === 1 ? 'hora' : 'horas'}`
  ]
  if (c.fotos) lineas.push(`• Fotos: ${c.fotos}`)
  lineas.push(`• Total: ${dinero(c.total)} USD`, '', 'Fecha de la boda: ', 'Lugar: ')
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`
}

export function iniciarCotizador() {
  const marcarServicio = grupoRadio(
    $('[data-servicios]'),
    Object.entries(SERVICIOS).map(([valor, s]) => ({ valor, html: s.nombre })),
    (valor) => { estado.servicio = valor; estado.extra = 0; actualizar() }
  )

  const marcarPaquete = grupoRadio(
    $('[data-paquetes]'),
    PAQUETES.map((p) => ({ valor: p.id, html: `<strong>${p.titulo}</strong><small>${p.etiqueta}</small>` })),
    (valor) => {
      estado.paquete = valor
      const p = PAQUETES.find((x) => x.id === valor)
      if (p.horas) estado.horas = p.horas
      else estado.horas = Number(rango.value)
      estado.extra = 0
      actualizar()
    }
  )

  const rango = $('[data-rango]')
  rango.addEventListener('input', () => {
    estado.horas = Number(rango.value)
    estado.extra = 0
    actualizar()
  })
  $('[data-menos]').addEventListener('click', () => { estado.extra = Math.max(0, estado.extra - PRECIOS.fotosPaso); actualizar() })
  $('[data-mas]').addEventListener('click', () => { estado.extra = Math.min(PRECIOS.fotosExtraMax, estado.extra + PRECIOS.fotosPaso); actualizar() })

  function actualizar() {
    const esCustom = estado.paquete === 'custom'
    const conFotos = SERVICIOS[estado.servicio].incluyeFotos
    const c = cotizar(estado.servicio, estado.horas, estado.extra)

    marcarServicio(estado.servicio)
    marcarPaquete(estado.paquete)

    $('[data-custom]').hidden = !esCustom
    rango.value = estado.horas
    rango.style.setProperty('--avance', ((estado.horas - 1) / 11) * 100 + '%')
    $('[data-horas-label]').textContent = `${estado.horas} ${estado.horas === 1 ? 'hora' : 'horas'}`

    $('[data-fotos-control]').hidden = !conFotos
    $('[data-fotos-valor]').textContent = c.fotos
    $('[data-menos]').disabled = estado.extra === 0
    $('[data-mas]').disabled = estado.extra >= PRECIOS.fotosExtraMax
    $('[data-fotos-nota]').textContent = estado.extra
      ? `${fotosIncluidas(estado.servicio, estado.horas)} incluidas + ${estado.extra} extra`
      : `+${PRECIOS.fotosPaso} fotos suman $${PRECIOS.precioPaso} · hasta ${PRECIOS.fotosExtraMax} extra`

    const nombre = SERVICIOS[estado.servicio].nombre
    const detalle = [`${estado.horas} h`, c.fotos ? `${c.fotos} fotos` : null, nombre].filter(Boolean).join(' · ')
    $('[data-detalle]').textContent = detalle
    $('[data-barra-detalle]').textContent = `${estado.horas} h · ${nombre}`

    const url = mensajeWhatsApp(c)
    $$('[data-reservar]').forEach((a) => (a.href = url))

    animarTotal(c.total)
  }

  function animarTotal(total) {
    const pintar = () => {
      const t = dinero(contador.valor)
      $('[data-total]').textContent = t
      $('[data-barra-total]').textContent = t
    }
    if (reducir || contador.valor === 0) {
      contador.valor = total
      pintar()
      return
    }
    gsap.to(contador, { valor: total, duration: 0.6, ease: 'power3.out', onUpdate: pintar, overwrite: true })
  }

  actualizar()
  barraMovil()
}

// Barra fija abajo en el celular: aparece mientras el cotizador está en pantalla
// pero el resumen con el botón grande todavía no se ve.
function barraMovil() {
  const barra = $('[data-barra]')
  let enCotizador = false
  let resumenVisible = false
  const pintar = () => {
    const mostrar = enCotizador && !resumenVisible
    barra.classList.toggle('visible', mostrar)
    barra.setAttribute('aria-hidden', !mostrar)
    barra.querySelector('a').tabIndex = mostrar ? 0 : -1
  }
  new IntersectionObserver(([e]) => { enCotizador = e.isIntersecting; pintar() }).observe($('#cotizador'))
  new IntersectionObserver(([e]) => { resumenVisible = e.isIntersecting; pintar() }, { threshold: 0.6 }).observe($('[data-resumen]'))
}

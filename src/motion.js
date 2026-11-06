import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Animaciones por scroll. Si la persona pidió "reducir movimiento", no se anima nada.
export function iniciarMotion() {
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Entrada del hero, línea por línea.
    gsap.from('.hero-titulo .linea', { yPercent: 110, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.12 })
    gsap.from('.hero .ceja, .hero-sub, .hero .boton', { y: 20, opacity: 0, duration: 0.8, delay: 0.4, stagger: 0.1, ease: 'power3.out' })
    gsap.from('.arco-forma', { scale: 0.85, opacity: 0, duration: 1.2, delay: 0.2, ease: 'expo.out' })

    // Al bajar, el arco se aleja y gira un poco; el texto del hero se desvanece.
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.arco', { yPercent: 25, rotate: -6, scale: 0.9 }, 0)
      .to('.hero-texto', { yPercent: -15, opacity: 0.2 }, 0)
      .to('.scroll-pista', { opacity: 0 }, 0)

    gsap.to('.destello', { y: -14, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.6 })

    // La línea vertical de "Cómo funciona" se dibuja con el scroll.
    gsap.fromTo('.pasos-linea span', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.pasos-lista', start: 'top 70%', end: 'bottom 60%', scrub: true }
    })
    gsap.utils.toArray('.paso').forEach((paso) => {
      gsap.from(paso, {
        x: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: paso, start: 'top 80%', toggleActions: 'play none none reverse' }
      })
    })

    // Bloques del cotizador y tarjetas de "incluye" entran escalonados.
    gsap.utils.toArray('.cot-cabecera, .segmentos, .bloque, .resumen').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
    })
    gsap.from('.incluye-lista li', {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.incluye-lista', start: 'top 80%' }
    })

    // El título final crece mientras entra en pantalla.
    gsap.fromTo('.cierre-titulo', { scale: 0.8, opacity: 0.3 }, {
      scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'center center', scrub: true }
    })
  })
}

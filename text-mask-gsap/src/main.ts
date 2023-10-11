import './style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

document.querySelector<HTMLDivElement>('#app')

gsap.registerPlugin(ScrollTrigger)

const elements = gsap.utils.toArray('.p-2')

elements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      scrub: true,
      // The animation starts 400px above the element and ends 400px below the element
      // The scroller start 3% from the top of the viewport
      start: '-400px 3%',
      end: `+=400px`,
    },
    clipPath: 'inset(0% 0% 0% 100%)',
    duration: 3,
    ease: 'power2.inOut',
  })
})

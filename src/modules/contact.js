import { addClass, removeClass, on } from 'utils/helpers';
import { gsap } from 'gsap';
import { $ } from 'select-dom';

export default function contact(el) {
  const triggerBtn = $('[data-contact-trigger');
  
  on(triggerBtn, 'click', () => {
    addClass(el, 'active');
  });
}
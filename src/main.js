import { splitIntoWords, splitIntoLetters, isTouchDevice, removeClass } from 'utils/helpers';
import { initScrollSnap } from 'components/ScrollSnapController.js';
import { $, $$ } from 'select-dom';
import 'scripts/init';
import 'styles/main.css';

initScrollSnap($('#sections-wrapper'));
splitIntoWords($$('.js-text-beautifier'));
splitIntoLetters($$('.js-text-beautifier a'));

if (isTouchDevice()) removeClass($('body'), 'no-touch');
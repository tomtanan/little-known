import { splitIntoWords, splitIntoLetters } from 'utils/helpers';
import { initScrollSnap } from 'components/ScrollSnapController.js';
import { $, $$ } from 'select-dom';
import 'scripts/init';
import 'styles/main.css';

splitIntoWords($$('.js-text-beautifier'));
splitIntoLetters($$('.js-text-beautifier a'));
initScrollSnap($('#sections-wrapper'));

import { wordSplit, letterSplit } from 'utils/helpers';
import { initScrollSnap } from 'components/ScrollSnapController.js';
import { $, $$ } from 'select-dom';
import 'scripts/init';
import 'styles/main.css';

wordSplit($$('.js-word-split'));
letterSplit($$('.js-letter-split'));

initScrollSnap($('#sections-wrapper'));

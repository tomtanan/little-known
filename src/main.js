import 'intersection-observer';
import { initScrollSnap } from 'components/ScrollSnapController.js';
import { $ } from 'select-dom';
import 'scripts/init';
import 'styles/main.css';

initScrollSnap($('#sections-wrapper'));

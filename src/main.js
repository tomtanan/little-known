import { createButton } from 'components/button.js';
import { greet } from 'utils/helpers.js';
import 'styles/main.css';

const button = createButton('Click Me!', () => {
  document.getElementById('message').textContent = greet();
});

document.getElementById('app').appendChild(button);

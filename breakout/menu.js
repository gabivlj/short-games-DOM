/* eslint-disable prefer-const */
/* eslint-disable no-undef */
let currentMenuDOM = 0;
const main = document.createElement('div');
main.className = 'menu';
const menuDOM = document.createElement('div');
menuDOM.innerHTML = `
  <div class="buttons">
    <button>Phase 1</button>
    <button>Phase 2</button>
    <button>Phase 3</button>
    <button>Phase 4</button>
    <button>Phase 5</button>
    <button class="back">Back</button>
  </div>
`;

const menuMain = document.createElement('div');
menuMain.innerHTML = `
  <div>
    <button id="menuMainButton">Play</button>
  </div>
`;

const menus = [menuMain, menuDOM];

function display() {
  main.innerHTML = '<h1 class="title">THE BREAKOUT</h1>';
  main.appendChild(menus[currentMenuDOM]);
  main.style.display = '';
}

menuMain.getElementsByTagName('button')[0].addEventListener('click', () => {
  currentMenuDOM = 1;
  display();
});

menuDOM.getElementsByClassName('back')[0].addEventListener('click', () => {
  currentMenuDOM = 0;
  display();
});

[...menuDOM.getElementsByTagName('button')].forEach(element => {
  element.addEventListener('click', e => {
    if (String(e.toElement.className) !== 'back') {
      console.log(e.toElement.innerHTML.split(' ')[1]);
      CURRENT_GAME = parseInt(e.toElement.innerHTML.split(' ')[1], 10) - 1;
      CURRENT_GAME_STATE = GAME_STATES.PLAYING;
      process();
      main.style.display = 'none';
      setInterval(() => {
        if (CURRENT_GAME_STATE === GAME_STATES.MENU) {
          main.style.display = '';
        }
        return null;
      }, 1);
    }
  });
});

document.body.appendChild(main);
display();

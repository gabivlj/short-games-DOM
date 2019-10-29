/* eslint-disable prefer-const */
/* eslint-disable no-undef */
let currentMenuDOM = 0;
const main = document.createElement('div');
main.className = 'menu';
const menuDOM = document.createElement('div');
const createButtonsMenu = scores => `
<div class="buttons">
  ${new Array(games.length)
    .fill(0)
    .reduce(
      (prev, now, index) =>
        `${prev}<button>Phase ${index + 1} Score: ${scores[index] ||
          0}</button>`,
      '',
    )}  
  <button class="redo fas fa-redo-alt"></button>
  <button class="create">Create a map</button>
  <button class="back">Back</button>
</div>
`;

menuDOM.innerHTML = createButtonsMenu(Store.getItem('scores') || {});

const menuForm = document.createElement('div');

menuForm.id = 'menuForm';
menuForm.innerHTML = `
    Brick Width
    <input type="number" input="input-brickWidth"></input>
    Brick Height
    <input type="number" input="input-brickWidth"></input>
    <button class="back">Back</button>
`;

const menuMain = document.createElement('div');
menuMain.id = 'menuMain';
menuMain.innerHTML = `
  <div>
    <button id="menuMainButton">Play</button>
    <h4>
      In game controls:
    </h4>
    <p>
      <br/>
      E - Go back. (Puntuation is saved)
      <br/>
      Mouse - X Axis Control.
      <br/>
      Ball Horizontal Speed depends of your horizontal movement
      <br/>
    </p>
    
  </div>
`;

const menus = [
  () => menuMain,
  () => {
    menuDOM.innerHTML = createButtonsMenu(Store.getItem('scores') || {});
    return menuDOM;
  },
  () => menuForm,
];

function display() {
  main.innerHTML = '<h1 class="title">THE BREAKOUT</h1>';
  main.appendChild(menus[currentMenuDOM]());
  main.style.display = '';
  menuMain.getElementsByTagName('button')[0].addEventListener('click', () => {
    currentMenuDOM = 1;
    display();
  });
  if (menus[currentMenuDOM]().id !== 'menuMain')
    menus[currentMenuDOM]()
      .getElementsByClassName('back')[0]
      .addEventListener('click', () => {
        currentMenuDOM = Math.max(0, currentMenuDOM - 1);
        display();
      });
  menuDOM.getElementsByClassName('redo')[0].addEventListener('click', () => {
    reset();
  });
  menuDOM.getElementsByClassName('create')[0].addEventListener('click', () => {
    currentMenuDOM = 2;
    display();
  });
  // We do this concat. because we cannot forEach() a NodeList, so this is a shortcut to Array.from().
  [...menuDOM.getElementsByTagName('button')].forEach(element => {
    element.addEventListener('click', e => {
      if (
        String(e.toElement.className) !== 'back' &&
        String(e.toElement.classList.item(0)) !== 'redo' &&
        String(e.toElement.className) !== 'create'
      ) {
        const number = e.toElement.innerHTML.split(' ')[1];
        if (!number) return;
        CURRENT_GAME = parseInt(number, 10) - 1;
        CURRENT_GAME_STATE = GAME_STATES.PLAYING;
        process();
        main.style.display = 'none';
        let stateBefore = CURRENT_GAME_STATE;
        setInterval(() => {
          if (CURRENT_GAME_STATE === GAME_STATES.MENU) {
            main.style.display = '';
          }
          if (
            CURRENT_GAME_STATE !== stateBefore &&
            GAME_STATES.MENU === CURRENT_GAME_STATE
          ) {
            display();
          }
          stateBefore = CURRENT_GAME_STATE;
          return null;
        }, 1);
      }
    });
  });
}

document.body.appendChild(main);
display();

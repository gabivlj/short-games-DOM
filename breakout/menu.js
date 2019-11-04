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

function addConfigMap(inputs) {
  const inputValues = inputs.map(input => parseFloat(input.value, 10));
  const inputValuesParsed = inputValues.filter(c => typeof c === 'number');
  if (inputValues.length !== inputValuesParsed.length)
    return { error: 'Check inputs!' };
  const [
    brickWidth,
    brickHeight,
    nBricksX,
    nBricksY,
    offsetX,
    offsetY,
    probabilityToAppear,
  ] = inputValuesParsed;
  const map = {
    brickHeight,
    brickWidth,
    nBricksX,
    nBricksY,
    offsetX,
    offsetY,
    probabilityToAppear,
  };
  Store.modifyItemArray('maps', array => {
    array.push(map);
    return array;
  });
  updateConfigMaps(map);
  reset();
  document.querySelector('.back').click();
  return {};
}

function getSubmitClick(menus) {
  const element = menus[currentMenuDOM]().getElementsByClassName(
    'submit-map',
  )[0];
  console.log(element);
  if (!element) return;
  element.addEventListener('click', e => {
    const inputs = [...menus[currentMenuDOM]().getElementsByClassName('input')];
    addConfigMap(inputs, element);
  });
}

menuDOM.innerHTML = createButtonsMenu(Store.getItem('scores') || {});

const menuForm = document.createElement('div');

menuForm.id = 'menuForm';
menuForm.innerHTML = `
  <div style="padding-left: 50px" class="form-map">
    <div>Brick Width:</div> 
    <input type="number" class="input input-brickWidth"></input>
    <br />
    Brick Height
    <input type="number" class="input input-brickHeight"></input>
    <br />
    Number of Bricks (X AXIS) 
    <input type="number" class="input input-nBricksX"></input>
    <br />
    Number of Bricks (Y AXIS)
    <input type="number" class="input input-nBricksY"></input>
    <br />
    Offset between bricks in X axis ( > Width )
    <input type="number" class="input input-offsetX"></input>
    <br />
    Offset between bricks in Y axis ( > Height )
    <input type="number" class="input input-offsetY"></input>
    <br />
    Probabilities to appear
    <input type="number" class="input input-probabilityToAppear"></input>
    <br />
    <button class="submit-map">Submit map</button>
    <button class="back">Back</button>
  <div>
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
    menuDOM.id = 'Menu2';
    return menuDOM;
  },
  () => menuForm,
];

function display() {
  main.innerHTML = '<h1 class="title">THE BREAKOUT</h1>';
  const menu = menus[currentMenuDOM]();
  main.appendChild(menu);
  main.style.display = '';
  if (menu.id === 'menuMain')
    menuMain.getElementsByTagName('button')[0].addEventListener('click', () => {
      currentMenuDOM = 1;
      display();
    });
  if (menu.id !== 'menuMain') {
    const button = menu.getElementsByClassName('back')[0];
    button.onclick = e => {
      console.log(currentMenuDOM);
      currentMenuDOM = Math.max(0, currentMenuDOM - 1);
      display();
    };
    if (menu.id !== 'Menu2') getSubmitClick(menus);
  }
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

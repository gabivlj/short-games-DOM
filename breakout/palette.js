const choose = (arr, splice = false) =>
  splice
    ? arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
    : arr[Math.floor(Math.random() * arr.length)];
const chooseSpecific = (arr, type = 'Random') =>
  type === 'Random' ? choose(arr, false) : arr.filter(e => e.type === type)[0];
const palettes = [
  {
    ballColor: '#86A5D9',
    brickColor: () => choose(['#5F4BB6', '#86A5D9', '#26F0F1', '#C4EBC8']),
    wallsColor: '#202A25',
    paddleColor: '#5F4BB6',
    type: 'Summer',
  },
  {
    ballColor: '#0267C1',
    brickColor: () => choose(['#5F4BB6', '#0267C1', '#591F0A', '#D65108']),
    wallsColor: '#0267C1',
    paddleColor: '#EFA00B',
    type: 'Winter',
  },
  {
    ballColor: '#9C89B8',
    brickColor: () => choose(['#F0A6CA', '#9C89B8', '#F0E6EF', '#B8BEDD']),
    wallsColor: '#9C89B8',
    paddleColor: '#F0E6EF',
    type: 'Winter',
  },
  {
    ballColor: '#0267C1',
    brickColor: () => choose(['#5F4BB6', '#0267C1', '#591F0A', '#D65108']),
    wallsColor: '#0267C1',
    paddleColor: '#EFA00B',
    type: 'Spring',
  },
];

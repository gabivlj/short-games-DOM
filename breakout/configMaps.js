/* eslint-disable no-undef */
let configMap = {
  0: {
    brickWidth: 110,
    brickHeight: 20.5,
    nBricksX: 1,
    nBricksY: 6,
    offsetX: 150,
    offsetY: 90,
    marginTop: 50,
    marginLeft: 200,
    probabilityToAppear: 0.5,
    ...choose(palettes, false),
  },
  1: {
    brickWidth: 50,
    brickHeight: 23.5,
    nBricksX: 13,
    nBricksY: 6,
    offsetX: 75,
    offsetY: 50,
    marginLeft: 45,
    marginTop: 50,
    probabilityToAppear: 0.5,
    ...choose(palettes, false),
  },
  2: {
    brickWidth: 100,
    brickHeight: 33.5,
    nBricksX: 16,
    nBricksY: 6,
    offsetX: 110,
    offsetY: 100,
    marginLeft: 45,
    marginTop: 50,
    probabilityToAppear: 1,
    ...choose(palettes, false),
  },
  ...(Store.getItem('maps') || []).reduce(
    (prev, now, index) => ({
      ...prev,
      [index + 3]: {
        ...now,
        ...chooseSpecific(palettes, now.type),
        marginLeft: 45,
        marginTop: 50,
      },
    }),
    {},
  ),
};

function updateConfigMaps(item) {
  configMap = {
    ...configMap,
    [Object.keys(configMap).length]: {
      ...item,
      ...chooseSpecific(palettes, item.type),
      marginLeft: 45,
      marginTop: 50,
    },
  };
}

console.log(configMap);

/* eslint-disable no-undef */
const NUMBER_OF_ORIGINAL_MAPS = 3;
const originalMaps = {
  0: {
    brickWidth: 110,
    brickHeight: 80,
    nBricksX: 10,
    nBricksY: 6,
    offsetX: 150,
    offsetY: 90,
    marginTop: 50,
    marginLeft: 200,
    probabilityToAppear: 1,
    ...choose(palettes, false),
  },
  1: {
    brickWidth: 60,
    brickHeight: 23.5,
    nBricksX: 24,
    nBricksY: 8,
    offsetX: 75,
    offsetY: 50,
    marginLeft: 45,
    marginTop: 50,
    probabilityToAppear: 0.9,
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
};

let configMap = {
  ...originalMaps,
  ...(Store.getItem('maps') || []).reduce(
    (prev, now, index) => ({
      ...prev,
      [index + NUMBER_OF_ORIGINAL_MAPS]: {
        ...now,
        ...chooseSpecific(palettes, now.type),
        marginLeft: 45,
        marginTop: 50,
      },
    }),
    {},
  ),
};

console.log(configMap);

function updateConfigMaps(item) {
  if (!item) {
    configMap = {
      ...originalMaps,
      ...(Store.getItem('maps') || []).reduce(
        (prev, now, index) => ({
          ...prev,
          [index + NUMBER_OF_ORIGINAL_MAPS]: {
            ...now,
            ...chooseSpecific(palettes, now.type),
            marginLeft: 45,
            marginTop: 50,
          },
        }),
        {},
      ),
    };
    Object.keys(configMap).forEach(k => {
      configMap[k] = {
        ...configMap[k],
        ...choose(palettes, false),
      };
    });
    return;
  }
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

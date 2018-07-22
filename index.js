const Jimp = require('jimp');
const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(2));

const setting = argv.s ? require(path.resolve(argv.s)) : { borderColor: 0xFF00FFFF, names: [] };
const BORDER_COLOR = setting.borderColor;

function getSubTilePixel(image, startX, startY) {
  const { width, height } = image.bitmap;

  for (let x2 = startX; x2 < width;  x2++) {
    if (
      image.getPixelColor(x2, startY) !== BORDER_COLOR
      && image.getPixelColor(x2 + 1, startY) === BORDER_COLOR
    ) {
      
      for (let y2 = startY; y2 < height; y2++) {
        if (
          image.getPixelColor(startX, y2) !== BORDER_COLOR
          && image.getPixelColor(startX, y2 + 1) === BORDER_COLOR
        ) {
          return [ startX , startY, x2 + 1 - startX, y2 + 1 - startY];
        }
      }
    }
  }
  return null;
}

async function main() {
  const image = await Jimp.read(path.resolve(argv._[0]));

  const { width, height } = image.bitmap;
  console.log(`width:${width} height:${height}`);

  const subTiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width;  x++) {
      if (
        image.getPixelColor(x, y) === BORDER_COLOR
        && image.getPixelColor(x + 1, y) === BORDER_COLOR
        && image.getPixelColor(x, y + 1) === BORDER_COLOR
        && image.getPixelColor(x + 1, y + 1) !== BORDER_COLOR
      ) {
        const subTile = getSubTilePixel(image, x + 1, y + 1);
        if (subTile) {
          subTiles.push(subTile);
        }
      }
    }
  }

  const basePath = path.resolve(argv._[0], '../');
  for (let i = 0; i < subTiles.length; i++) {
    await image
      .clone()
      .crop(...subTiles[i])
      .write(path.resolve(basePath, `${setting.names[i] || i}.${image.getExtension()}`))
  }
}

main().catch(e => console.error(e));
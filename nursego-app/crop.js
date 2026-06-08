const sharp = require('sharp');
const path = require('path');

async function processImage() {
  try {
    const original = 'C:\\Users\\91985\\.gemini\\antigravity\\brain\\704bc962-ebbe-481a-942f-0ae850f610cf\\media__1780941465316.png';
    
    // 1. Extract the full width (678px) to guarantee no letters are horizontally cut!
    // We only crop the top and bottom 96 pixels to remove the black letterbox bars.
    const buffer = await sharp(original)
      .extract({ width: 678, height: 480, left: 0, top: 96 })
      .toBuffer();

    // 2. Put it on a mathematically calculated 850x850 white canvas.
    // This exact ratio ensures that when shrunk to a 150x150 circle,
    // the corners of the 678x480 box are at a radius of 72.8px,
    // safely inside the circle's 75px radius, without being too small!
    await sharp({
      create: {
        width: 850,
        height: 850,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([
        {
          input: buffer,
          gravity: 'center'
        }
      ])
      .png()
      .toFile('assets/nursego_logo.png');

    console.log('Logo perfectly processed without cutting width!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

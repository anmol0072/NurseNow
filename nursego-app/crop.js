const sharp = require('sharp');

async function processImage() {
  try {
    // 1. Crop the center 600x600 to remove any letterboxing or borders
    const buffer = await sharp('assets/nursego_logo.png')
      .extract({ width: 600, height: 600, left: 39, top: 36 })
      .toBuffer();

    // 2. Put it on a perfectly square 800x800 white canvas
    await sharp({
      create: {
        width: 800,
        height: 800,
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

    console.log('Logo successfully cropped and padded!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

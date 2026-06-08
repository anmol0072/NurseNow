const sharp = require('sharp');

async function processImage() {
  try {
    const original = 'C:\\Users\\91985\\.gemini\\antigravity\\brain\\704bc962-ebbe-481a-942f-0ae850f610cf\\media__1780941465316.png';
    
    // 1. Auto-trim the black edges. This leaves ONLY the exact white box containing the logo.
    const trimmedBuffer = await sharp(original).trim().toBuffer();
    
    // Get the dimensions of the trimmed white box
    const metadata = await sharp(trimmedBuffer).metadata();
    console.log(`Trimmed size: ${metadata.width}x${metadata.height}`);

    // 2. We want to pad it with pure white so the logo is perfectly safe from circular clipping.
    // The diagonal of the white box shouldn't exceed the circle diameter.
    // To safely fit a WxH box inside a circle without ANY clipping:
    // The canvas should be roughly 1.41 * max(W, H)
    const maxSize = Math.max(metadata.width, metadata.height);
    const canvasSize = Math.ceil(maxSize * 1.5); // 50% padding for complete safety

    await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([
        {
          input: trimmedBuffer,
          gravity: 'center'
        }
      ])
      .png()
      .toFile('assets/nursego_logo.png');

    console.log(`Padded on a ${canvasSize}x${canvasSize} white canvas. Done!`);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();

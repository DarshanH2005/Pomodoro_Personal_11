const fs = require('fs');
const path = require('path');

// Create a simple MP3 header (this is a minimal valid MP3 file)
const createMinimalMP3 = () => {
  // This is a minimal MP3 file header - not a real sound but valid MP3 format
  const mp3Header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  return mp3Header;
};

const soundsDir = path.join(__dirname, '../public/sounds');

// Ensure the sounds directory exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const soundFiles = [
  'work-complete.mp3',
  'break-complete.mp3', 
  'button-click.mp3',
  'timer-tick.mp3',
  'bell.mp3',
  'chime.mp3',
  'ding.mp3',
  'xylophone.mp3'
];

console.log('Generating placeholder sound files...');

soundFiles.forEach(filename => {
  const filePath = path.join(soundsDir, filename);
  const mp3Data = createMinimalMP3();
  
  fs.writeFileSync(filePath, mp3Data);
  console.log(`Created: ${filename} (${mp3Data.length} bytes)`);
});

console.log('\nNote: These are placeholder files. For real sounds, replace them with actual MP3 files.');
console.log('You can find free sound effects at:');
console.log('- https://freesound.org/');
console.log('- https://mixkit.co/free-sound-effects/');
console.log('- https://www.zapsplat.com/'); 
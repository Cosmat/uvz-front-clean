const fs = require('fs');
const path = require('path');

// Read VUE_APP_API_URL from environment, fallback to Render API
const apiUrl = process.env.VUE_APP_API_URL || 'https://uvz-api.onrender.com';

const configContent = `window.__RUNTIME_CONFIG__ = {
  VUE_APP_API_URL: "${apiUrl}"
};`;

const outputDir = path.join(__dirname, '../dist/spa');
const outputFile = path.join(outputDir, 'config.js');

// Ensure dist/spa exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, configContent);
console.log('=== Generated config.js ===');
console.log(configContent);
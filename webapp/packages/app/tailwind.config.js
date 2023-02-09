module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/@labelstack/viewer/src/**/*.{ts,tsx,css}',
    '../../node_modules/@labelstack/annotator/src/**/*.{ts,tsx,css}'
  ],
  plugins: [],
  presets: [require('../../tailwind.config.js')]
};

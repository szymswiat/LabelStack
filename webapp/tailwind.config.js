module.exports = {
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5acce6',
          main: '#0944b3',
          dark: '#1a1717',
          active: '#348cfd'
        },
        secondary: {
          light: '#3a3f99',
          main: '#2b166b',
          dark: '#413a3a',
          active: '#1f1f27'
        },
        light: {
          primary: '#5acce6',
          secondary: '#3a3f99',
          main: '#2b166b',
          active: '#348cfd'
        },
        dark: {
          primary: '#1a1717',
          secondary: '#413a3a',
          main: '#0944b3',
          active: '#1f1f27'
        }
      },
      height: {
        100: '25rem'
      },
      width: {
        100: '25rem'
      },
      maxWidth: {
        16: '4rem'
      },
      maxHeight: {
        '1/2': '50%'
      }
    }
  }
};

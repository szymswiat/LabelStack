module.exports = {
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: { // for now used only by task app
          light: '#5acce6',
          main: '#0944b3',
          dark: '#1a1717',
          active: '#348cfd'
        },
        secondary: { // for now used only by task app
          light: '#3a3f99',
          main: '#2b166b',
          dark: '#413a3a',
          active: '#1f1f27'
        },
        dark: { // for now used only by viewer
          'bg': '#282828',
          'card-bg': '#0B0B10',
          'accent': '#5ACCE6',
          'text': '#F3DBDB',
          'dark-text': '#0B0B10'
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
      },
      boxShadow: {
        'layout-custom-dark': '0px 8px 10px 1px hsla(0,0%,0%,0.14), 0px 3px 14px 2px hsla(0,0%,0%,0.12), 0px 5px 5px -3px hsla(0,0%,0%,0.2)',
      },
    }
  }
};

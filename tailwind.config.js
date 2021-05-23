const iOSHeight = require('@rvxlab/tailwind-plugin-ios-full-height');

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"Helvetica Neue"', 'Helvetica', 'ui-sans-serif', 'system-ui'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {},
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    iOSHeight,
  ],
}

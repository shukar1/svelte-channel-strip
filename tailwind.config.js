module.exports = {
  darkMode: 'class', // This can be 'media' if preferred.
  purge: [
    './src/**/*.svelte',
    './src/**/*.html',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
        'ew-resize': 'ew-resize',
        pointer: 'pointer',
        cell: 'cell'
      }
    }
  },
  variants: {},
  plugins: []
};

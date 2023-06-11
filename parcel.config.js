module.exports = {
  // Specify the entry point of your application
  entry: 'src/main.ts',

  // Add a transformer for TypeScript files
  transform: {
    '^.+\\.ts$': 'tsify',
  },
};

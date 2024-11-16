import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    pluginJs.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: { sourceType: 'commonjs' },
        rules: {
            'no-global-assign': 'off'
        }
    },
    { languageOptions: { globals: globals.node } }
];

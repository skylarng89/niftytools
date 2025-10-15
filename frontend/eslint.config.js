import js from '@eslint/js'
import typescript from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueConfigTypescript from '@vue/eslint-config-typescript'

export default [
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.config.js']
  },
  
  // Base recommended configs
  js.configs.recommended,
  ...typescript.configs.recommended,
  ...vue.configs['flat/recommended'],
  
  // Vue TypeScript config
  {
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        __APP_VERSION__: 'readonly'
      },
      parserOptions: {
        parser: typescript.parser
      }
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // Vue specific rules (relaxed for migration)
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/attributes-order': 'off',
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Temporarily disabled for migration
      '@typescript-eslint/no-empty-object-type': 'off', // Allow {} types for now
      
      // General rules
      'no-console': 'off', // Temporarily disabled for migration
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error'
    }
  },
  
  // Test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.vue', '**/*.spec.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'vue/one-component-per-file': 'off'
    }
  }
]
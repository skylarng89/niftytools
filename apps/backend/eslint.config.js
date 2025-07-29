import js from '@eslint/js'
import typescript from 'typescript-eslint'

export default typescript.config(
  // Base recommended configs
  js.configs.recommended,
  ...typescript.configs.recommended,
  
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.config.js']
  },
  
  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // General rules
      'no-console': 'off', // Allow console in backend
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error'
    }
  },
  
  // Test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
)
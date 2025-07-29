module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [0],         // disables type checking
    'scope-enum': [0],        // disables scope checking
    'scope-empty': [0],       // allows empty scope
    'subject-case': [0],      // disables subject case check
    'header-max-length': [0], // disables max length check
  }
};
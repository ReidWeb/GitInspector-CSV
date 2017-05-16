module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "impliedStrict" : true
  },
  'env': {
    'node': true,
  },
  'extends': 'airbnb-base',
  'plugins': [
    'import',
  ],
  "rules": {
    "no-plusplus": "off",
    "strict" : "off",
    "lines-around-directive" : "off",
    "no-underscore-dangle": ["error", { "allow": ["__get__"] }],
    "no-param-reassign": "off"
  }
};
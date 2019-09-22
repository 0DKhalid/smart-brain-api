const { check } = require('express-validator');

module.exports = [
  check('name')
    .isLength({ min: 4, max: 8 })
    .withMessage('name length between 4 and 8 character'),
  check('email')
    .isEmail()
    .withMessage('invalid email'),
  check('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/g)
    .withMessage(
      'password shold contain one character uppercase and one lowerCase and spacial character'
    )
];

const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { description } = require('../../../models/ecommerces-schema');
const { createEcommerce, updateEcommerce } = require('./users-repository');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('Password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },

  createEcommerce: {
    body: {
      product: joi.string().required().label('Product'),
      description: joi.string().required().label('Description'),
      price: joi.string().required().label('Price'),
      quantity: joi
        .number()
        .precision(2)
        .min(0)
        .max(99999999.99)
        .required()
        .label('Quantity'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  updateEcommerce: {
    body: {
      price: joi.string().required().label('Price'),
      quantity: joi
        .number()
        .precision(2)
        .min(0)
        .max(99999999.99)
        .required()
        .label('Quantity'),
    },
  },

  changePassword: {
    body: {
      password_old: joi.string().required().label('Old password'),
      password_new: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(32)
        .required()
        .label('New password'),
      password_confirm: joi.string().required().label('Password confirmation'),
    },
  },
};

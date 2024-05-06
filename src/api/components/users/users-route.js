const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsers);

  // Get list of users
  route.get(
    '/ecommerce/purchases',
    authenticationMiddleware,
    usersControllers.getEcommerces
  );

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Create purchase
  route.post(
    '/ecommerce',
    authenticationMiddleware,
    celebrate(usersValidator.createEcommerce),
    usersControllers.createEcommerce
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Update purchase
  route.put(
    '/ecommerce/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateEcommerce),
    usersControllers.updateEcommerce
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Delete purchase
  route.delete(
    '/ecommerce/:id',
    authenticationMiddleware,
    usersControllers.deleteEcommerce
  );

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );
};

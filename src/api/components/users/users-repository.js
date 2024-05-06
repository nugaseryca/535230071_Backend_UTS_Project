const { User, Ecommerce } = require('../../../models');

/**
 * Get a list of users with pagination, sorting, and filtering
 * @param {number} page_number - Page number
 * @param {number} page_size - Number of items per page
 * @param {Object} sortCriteria - Sorting criteria
 * @param {Object} searchQuery - Search query
 * @returns {Promise}
 */
async function getUsers(page_number, page_size, sortCriteria, searchQuery) {
  return User.find(searchQuery)
    .sort(sortCriteria)
    .skip((page_number - 1) * page_size)
    .limit(page_size);
}

/**
 * Get a list of purchases
 * @returns {Promise}
 */
async function getEcommerces() {
  return Ecommerce.find({});
}

/**
 * Get purchase detail
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function getEcommerce(id) {
  return Ecommerce.findById(id);
}

/**
 * Count total users with search query
 * @param {Object} searchQuery - Search query
 * @returns {Promise}
 */
async function countUsers(searchQuery) {
  return User.countDocuments(searchQuery);
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Create new purchase
 * @param {string} product - Product
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function createEcommerce(product, description, price, quantity) {
  return Ecommerce.create({
    product,
    description,
    price,
    quantity,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Update existing purchase
 * @param {string} id - Purchase ID
 * @param {string} price - Product
 * @param {string} quantity - Quantity
 * @returns {Promise}
 */
async function updateEcommerce(id, price, quantity) {
  return Ecommerce.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Delete a purchase
 * @param {string} id - Purchase ID
 * @returns {Promise}
 */
async function deleteEcommerce(id) {
  return Ecommerce.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getEcommerces,
  getEcommerce,
  getUser,
  createUser,
  createEcommerce,
  updateUser,
  updateEcommerce,
  deleteUser,
  deleteEcommerce,
  getUserByEmail,
  changePassword,
  countUsers,
};

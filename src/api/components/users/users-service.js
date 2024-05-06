const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users with pagination, sorting, and filtering
 * @param {number} page_number - Page number
 * @param {number} page_size - Number of items per page
 * @param {string} sort - Sorting field and order
 * @param {string} search - Search field and keyword
 * @returns {Object}
 */
async function getUsers(
  page_number = 1,
  page_size = 10,
  sort = 'email:asc',
  search
) {
  // Parsing sort parameter
  const [sortField, sortOrder] = sort.split(':');
  const sortCriteria = {};
  sortCriteria[sortField] = sortOrder === 'desc' ? -1 : 1;

  // Constructing search query
  const searchQuery = {};
  if (search) {
    const [searchField, searchKey] = search.split(':');
    searchQuery[searchField] = { $regex: new RegExp(searchKey, 'i') }; // Case-insensitive search
  }

  // Count total users
  const count = await usersRepository.countUsers(searchQuery);

  // Calculate total pages
  const total_pages = Math.ceil(count / page_size);

  // Fetch users with pagination, sorting, and filtering
  const users = await usersRepository.getUsers(
    page_number,
    page_size,
    sortCriteria,
    searchQuery
  );

  return {
    page_number,
    page_size,
    count,
    total_pages,
    has_previous_page: page_number > 1,
    has_next_page: page_number < total_pages,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
}

/**
 * Get list of purchases
 * @returns {Array}
 */
async function getEcommerces() {
  const ecommerces = await usersRepository.getEcommerces();

  const results = [];
  for (let i = 0; i < ecommerces.length; i += 1) {
    const ecommerce = ecommerces[i];
    results.push({
      product: ecommerce.product,
      description: ecommerce.description,
      price: ecommerce.price,
      quantity: ecommerce.quantity,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Create new purchase
 * @param {string} product - Product
 * @param {string} description - Description
 * @param {string} price - Price
 * @param {string} quantity - Quantity
 * @returns {boolean}
 */
async function createEcommerce(product, description, price, quantity) {
  try {
    await usersRepository.createEcommerce(
      product,
      description,
      price,
      quantity
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing purchase
 * @param {string} id - Purchase ID
 * @param {string} product - Product
 * @param {string} quantity - Quantity
 * @returns {boolean}
 */
async function updateEcommerce(id, product, quantity) {
  const ecommerce = await usersRepository.getEcommerce(id);

  // Purchase not found
  if (!ecommerce) {
    return null;
  }

  try {
    await usersRepository.updateEcommerce(id, product, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete purchase
 * @param {string} id - Purchase ID
 * @returns {boolean}
 */
async function deleteEcommerce(id) {
  const ecommerce = await usersRepository.getEcommerce(id);

  // Purchase not found
  if (!ecommerce) {
    return null;
  }

  try {
    await usersRepository.deleteEcommerce(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getEcommerces,
  getUser,
  createUser,
  createEcommerce,
  updateUser,
  updateEcommerce,
  deleteUser,
  deleteEcommerce,
  emailIsRegistered,
  checkPassword,
  changePassword,
};

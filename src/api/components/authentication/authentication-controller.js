const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Simpan informasi upaya gagal login
const failedLoginAttempts = {};

// Fungsi untuk memeriksa dan menghitung upaya login gagal
function checkFailedLoginAttempts(email) {
  if (!failedLoginAttempts[email]) {
    failedLoginAttempts[email] = 0;
  }
  return failedLoginAttempts[email];
}

// Fungsi untuk menghapus hitungan upaya gagal setelah 30 menit
function resetFailedLoginAttempts(email) {
  delete failedLoginAttempts[email];
}

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check failed login attempts
    const attempts = checkFailedLoginAttempts(email);
    if (attempts >= 5) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment failed login attempts
      failedLoginAttempts[email] = attempts + 1;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset failed login attempts on successful login
    resetFailedLoginAttempts(email);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

const register = async ({ email, password, name }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ email, password: hashedPassword, name });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token
  };
};

module.exports = { register, login };

require('dotenv').config();
const jwt = require('jsonwebtoken');
var User = require('../models').User;
const bcrypt = require("bcrypt");

const generateToken = (userId, isAdmin) => {
  return jwt.sign({ userId, isAdmin }, process.env.SECRET_KEY, { expiresIn: "1h" });
};

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const minLength = 8; // Minimum length of 8 characters
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return password.length >= minLength && strongPasswordRegex.test(password);
};

const validateUserInput = (email, password) => {
  if (!isValidEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  if (!isStrongPassword(password)) {
    return { isValid: false, message: 'Password is not strong enough. It should have at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.' };
  }

  return { isValid: true, message: '' };
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateUserInput(email, password)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user.id, user.isAdmin);
    res.status(201).json({ "Name": user.name, "Email": user.email, "Token": token });
  } catch (error) {
    console.log(error, "<<< error register")
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateUserInput(email, password)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.isAdmin);
    res.status(200).json({ "Name": user.name, "Email":user.email, "Token": token });
  } catch (error) {
    console.log(error, "<<< error login")
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };

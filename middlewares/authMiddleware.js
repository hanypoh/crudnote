const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

const checkAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { checkAuth };

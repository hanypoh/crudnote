const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes/index_routes');

const app = express();
app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(routes);

// Handle 404 Error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
  });
});

// Sinkronisasi basis data Sequelize
sequelize
  .sync()
  .then(() => {
    console.log('Connected to the database.');
    // Jalankan server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = app;
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: '192.168.5.11',
  user: 'mysqlusr',
  password: 'dBLclrEP(?vM1!',
  database: 'tempZeus'
});

// User registration endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  // Validate request body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if user already exists
  pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error checking for existing user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Insert new user into the database
    pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
    });
  });
});

// User login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    res.status(200).json({ message: 'Login successful', userId: user.user_id });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

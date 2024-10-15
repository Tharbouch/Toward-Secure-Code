const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const users = require('./users.json')
const http = require('http');
const dotenv= require('dotenv').config()

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY

// Middleware to authenticate JWT 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    // Verify the token using the secret key and specify the algorithm to be used 
    jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

// Middleware for RBAC
function authorizeRoles(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden if role doesn't match
        }
        next();
    };
}

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    if (user) {
        // Specifying Token Expiry and algorithm used , should create a refresh token and point later 
        const accessToken = jwt.sign(
            { 
                username: user.username,
                role: user.role 
            },
            SECRET_KEY,
            {
                algorithm: 'HS256',
                expiresIn: '15min',
            }
      
        );
        res.json({ accessToken });
    } else {
        res.status(401).send('Username or password incorrect');
    }
});

// Public route
app.get('/public', (req, res) => {
    res.send('This is a public endpoint accessible to everyone.');
});

// User route
app.get(
    '/user',
    authenticateToken,
    authorizeRoles(['user', 'admin']),
    (req, res) => {
        res.send(`Hello ${req.user.username}, welcome to the user area.`);
    }
);

// Admin route
app.get('/admin', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to the admin area.`);
});

// Start the server
const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Vulnerable server running on port 3000');
});
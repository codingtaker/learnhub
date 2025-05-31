require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();


mongoose.connect("mongodb://localhost:27017/learnhub")
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000
    }
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/course', require('./routes/course.routes'));


module.exports = app;
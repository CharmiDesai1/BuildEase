require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
dbOperation = require('./dbFiles/dbOperation');
const sql = require('mssql');
const config = require('./dbFiles/dbconfig');
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
const bcrypt = require('bcrypt');

const API_PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('Google profile:', profile);
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      await poolConnect;

      const { displayName, emails } = req.user;
      const email = emails[0].value;
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      await pool.request()
        .input('full_name', sql.VarChar, displayName)
        .input('email', sql.VarChar, email)
        .input('password_hash', sql.VarChar, hashedPassword)
        .query(`
          IF NOT EXISTS (SELECT * FROM Developer WHERE email = @email)
          BEGIN
            INSERT INTO Developer (full_name, email, password_hash)
            VALUES (@full_name, @email, @password_hash)
          END
        `);

      console.log('Google user saved with random password');
      res.redirect('http://localhost:3000/developers-landing-page');
    } catch (error) {
      console.error('Google Auth Database Error:', error);
      res.status(500).send('Database error');
    }
  }
);

app.post('/signup', async (req, res) => {
  console.log("Data received on backend:", req.body);
    const { fullName, email, password} = req.body;
    try {
      const result = await dbOperation.insertDeveloper(fullName, email, password);
      res.status(200).send({ message: 'User registered successfully', result });
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).send({ message: 'Error registering user', error });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('email', sql.VarChar(100), email)
        .query('SELECT * FROM Developer WHERE email = @email');
  
      if (result.recordset.length === 0) {
        return res.status(401).send({ message: 'Invalid user' });
      }
  
      const developer = result.recordset[0];
      const isPasswordValid = await bcrypt.compare(password, developer.password_hash);
  
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid password' });
      }
  
      res.status(200).send({ message: 'Login successful', developer });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).send({ message: 'Login failed', error });
    }
  });
  
  app.get("/api/projects", async (req, res) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().query("SELECT * FROM Projects");
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbOperation = require('./dbFiles/dbOperation');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sql = require("mssql");
const dbConfig = require("./dbFiles/dbConfig");

const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const displayName = profile.displayName;

        // 🔹 Check if user exists in Developer or Users table
        const isDeveloper = await dbOperation.getDevelopers().then(devs => devs.some(dev => dev.email === email));
        const isUser = await dbOperation.getUsers().then(users => users.some(user => user.email === email));

        if (isDeveloper) {
          console.log("Developer Login Successful");
          return done(null, { email, role: "developer" });
        } else if (isUser) {
          console.log("User Login Successful");
          return done(null, { email, role: "user" });
        } else {
          console.log("New User - Registering as Regular User");
          await dbOperation.googleLoginUser(displayName, email);
          return done(null, { email, role: "user" });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 🔹 Google Auth Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google Auth Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User after login:", req.user); // Debugging

    if (req.user.role === "developer") {
      res.redirect("http://localhost:3000/developers-landing-page");
    } else {
      res.redirect("http://localhost:3000/home-user-page");
    }
  }
);

app.post('/signup', async (req, res) => {
  console.log("Data received on backend:", req.body);
  const { fullName, email, password } = req.body;
  
  try {
    const result = await dbOperation.insertDeveloper(fullName, email, password);
    res.status(200).send({ message: 'User registered successfully', result });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send({ message: 'Error registering user', error });
  }
});

app.post('/signup-user', async (req, res) => {
  console.log("Data received on backend:", req.body);
  const { fullName, email, password } = req.body;
  
  try {
    const result = await dbOperation.insertUser(fullName, email, password);
    res.status(200).send({ message: 'User registered successfully', result });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send({ message: 'Error registering user', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await dbOperation.loginDeveloper(email, password);
    
    if (!result.success) {
      return res.status(401).send({ message: result.message });
    }

    res.status(200).send({ message: 'Login successful', developer: result.developer });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ message: 'Login failed', error });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await dbOperation.getProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query("SELECT id, project_name, apartment_type, carpet_area, development_stage, rating, image_url FROM PdfDocuments");

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      console.log("❌ Invalid or missing ID.");
      return res.status(400).send("Bad Request: Invalid PDF ID.");
    }

    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT file_name, file_data FROM PdfDocuments WHERE id = @id");

    if (result.recordset.length === 0) {
      console.log(`❌ No PDF found for ID: ${id}`);
      return res.status(404).send("File not found.");
    }

    const { file_name, file_data } = result.recordset[0];

    if (!file_data || !(file_data instanceof Buffer)) {
      console.log(`❌ Invalid PDF data for ID: ${id}`);
      return res.status(404).send("PDF data is missing or corrupted.");
    }

    res.setHeader("Content-Disposition", `inline; filename="${file_name}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", file_data.length);

    console.log(`✅ Sending PDF: ${file_name} (ID: ${id})`);
    res.send(file_data);
  } catch (error) {
    console.error(`❌ Error fetching PDF (ID: ${req.params.id}):`, error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
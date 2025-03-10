require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbOperation = require('./dbFiles/dbOperation');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sql = require("mssql");
const { fetchProjects, getPdfById } = require("./dbFiles/dbOperation");
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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User after login:", req.user);

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
    const projects = await fetchProjects();
    res.json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/download/:id", async (req, res) => {
  try {
    const { id, file_name, file_data } = await getPdfById(req.params.id);
    if (!file_data) {
      return res.status(404).send("File not found.");
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

app.get("/user-properties/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT id, project_name, apartment_type, carpet_area, development_stage, image_url FROM UserPropertyDocuments WHERE user_id = @userId");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No properties found for this user." });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching user properties:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});  

app.get("/download-property/:userId/:propertyId/:fileType", async (req, res) => {
try {
  const { userId, propertyId, fileType } = req.params;

  if (!["brochure", "floorplan"].includes(fileType)) {
    return res.status(400).json({ message: "Invalid file type requested." });
  }

  const pool = await sql.connect(dbConfig);
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("propertyId", sql.Int, propertyId)
    .query(
      `SELECT 
        ${fileType === "brochure" ? "brochure_file_name, brochure_file_data" : "floor_plan_file_name, floor_plan_file_data"} 
       FROM UserPropertyDocuments 
       WHERE user_id = @userId AND id = @propertyId`
    );

  if (result.recordset.length === 0) {
    return res.status(404).json({ message: "File not found for the given property." });
  }

  const fileName = result.recordset[0][`${fileType}_file_name`];
  const fileData = result.recordset[0][`${fileType}_file_data`];

  if (!fileData) {
    return res.status(404).json({ message: "File data is missing or corrupted." });
  }

  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/pdf");
  res.send(fileData);
} catch (error) {
  console.error("❌ Error downloading file:", error);
  res.status(500).send("Internal Server Error: " + error.message);
}
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
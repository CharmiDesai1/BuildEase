require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require("axios");
const bodyParser = require('body-parser');
const dbOperation = require('./dbFiles/dbOperation');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sql = require("mssql");
const { fetchProjects, getPdfById, getBrochureById} = require("./dbFiles/dbOperation");
const dbConfig = require("./dbFiles/dbConfig");
const fs = require("fs-extra");
const path = require("path");
const poppler = require("pdf-poppler");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const PDFDocument = require("pdfkit");

const TEMP_IMAGE_DIR = path.join(__dirname, "temp_images");
fs.ensureDirSync(TEMP_IMAGE_DIR);
const UPLOADS_DIR = path.join(__dirname, "uploads", "annotated");
fs.ensureDirSync(UPLOADS_DIR);

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

        const developers = await dbOperation.getDevelopers();
        const users = await dbOperation.getUsers();

        const developer = developers.find(dev => dev.email === email);
        const user = users.find(u => u.email === email);

        if (developer) {
          console.log("✅ Developer Login Successful");
          return done(null, { email, developer_id: developer.developer_id, role: "developer" });
        } 
        else if (user) {
          console.log("✅ User Login Successful");
          return done(null, { email, user_id: user.user_id, role: "user" });
        } 
        else {
          console.log("🆕 New User - Registering as Regular User");
          await dbOperation.googleLoginUser(displayName, email); 

          const newUser = await dbOperation.getUserByEmail(email);
          if (newUser && newUser.user_id) {
            return done(null, { email, user_id: newUser.user_id, role: "user" });
          } else {
            return done(new Error("❌ Failed to retrieve new user ID"), null);
          }
        }
      } catch (error) {
        console.error("❌ Google Authentication Error:", error);
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
    console.log("✅ User after login:", req.user);

    if (!req.user || (!req.user.user_id && !req.user.developer_id)) {
      console.error("❌ Google Login Failed: Missing user ID");
      return res.redirect("http://localhost:3000/login?error=id_missing");
    }

    if (req.user.role === "developer") {
      res.redirect(`http://localhost:3000/developers-landing-page?developerId=${req.user.developer_id}`);
    } else {
      res.redirect(`http://localhost:3000/home-user-page?userId=${req.user.user_id}`);
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
  console.log("Login route hit with email:", email);
  try {
    const result = await dbOperation.loginDeveloper(email, password)
    
    if (!result.success) {
      return res.status(401).send({ message: result.message });
    }

    res.status(200).send({ message: 'Login successful', developer: result.developer });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send({ message: 'Login failed', error });
  }
});

app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;

  try {
      console.log("📡 Login API called with:", email);
      const result = await dbOperation.loginUser(email, password);

      if (!result.success) {
          console.error("❌ Login failed:", result.message);
          return res.status(401).json({ message: result.message });
      }

      console.log("✅ User Login Successful:", result.user);

      if (!result.user || !result.user.user_id) {
          console.error("❌ user_id is missing in backend response!");
          return res.status(500).json({ message: "User ID missing in response" });
      }

      return res.status(200).json({ message: "Login successful", user: result.user });

  } catch (error) {
      console.error("❌ Login Error (Full Error Log):", error);
      return res.status(500).json({ message: "Login failed", error: error.message });
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

app.get("/annotations/:property_id", async (req, res) => {
  try {
    const { property_id } = req.params;

    if (!property_id) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    console.log(`📌 Fetching annotations for property_id: ${property_id}`);

    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("property_id", sql.Int, property_id)
      .query(`
        SELECT DISTINCT
            a.user_id, 
            u.full_name AS username, 
            a.annotated_file_name
        FROM Annotations a
        JOIN Users u ON a.user_id = u.user_id
        WHERE a.property_id = @property_id
      `);

    if (result.recordset.length === 0) {
      console.log(`❌ No annotations found for property_id: ${property_id}`);
      return res.status(404).json({ message: "No annotations found for this property" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error(`❌ Error fetching annotations for property ID: ${req.params.property_id}`, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/annotated/:property_id/:user_id/:file_name", async (req, res) => {
  try {
    const { property_id, user_id, file_name } = req.params;
    const imagePath = path.join(UPLOADS_DIR, property_id, user_id, file_name);

    console.log(`🔍 Fetching file from database for: ${property_id}, ${user_id}, ${file_name}`);

    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("property_id", sql.Int, property_id)
      .input("user_id", sql.Int, user_id)
      .input("file_name", sql.NVarChar, file_name)
      .query(`
        SELECT annotated_file_data 
        FROM Annotations 
        WHERE property_id = @property_id 
        AND user_id = @user_id 
        AND annotated_file_name = @file_name
      `);

    if (result.recordset.length === 0 || !result.recordset[0].annotated_file_data) {
      console.error(`❌ File not found in database.`);
      return res.status(404).json({ error: "File not found" });
    }

    const fileData = result.recordset[0].annotated_file_data;

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    fs.ensureDirSync(path.dirname(imagePath));
    fs.writeFileSync(imagePath, fileData);
    console.log(`✅ Updated file saved at: ${imagePath}`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${file_name}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.image(imagePath, { fit: [500, 700], align: "center", valign: "center" });
    doc.end();

  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/annotated/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT annotated_floor_plan_file_name, annotated_floor_plan_file_data 
        FROM Properties 
        WHERE property_id = @id
      `);

    if (result.recordset.length === 0 || !result.recordset[0].annotated_floor_plan_file_data) {
      return res.status(404).json({ message: "Annotated file not found" });
    }

    const { annotated_floor_plan_file_name, annotated_floor_plan_file_data } = result.recordset[0];

    if (!annotated_floor_plan_file_data) {
      return res.status(400).json({ message: "No annotated image available" });
    }
    const imageBuffer = Buffer.from(annotated_floor_plan_file_data);
    const tempDir = path.join(__dirname, "temp");
    fs.ensureDirSync(tempDir);
    const imagePath = path.join(tempDir, `annotated_${id}.png`);
    const pdfPath = path.join(tempDir, `annotated_${id}.pdf`);
    fs.writeFileSync(imagePath, imageBuffer);
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.addPage({ size: "A4" });
    doc.image(imagePath, {
      fit: [500, 700], 
      align: "center",
      valign: "center",
    });
    doc.end();
    stream.on("finish", () => {
      res.setHeader("Content-Disposition", `inline; filename="annotated_${id}.pdf"`);
      res.setHeader("Content-Type", "application/pdf");
      console.log(`✅ Sending PDF: ${annotated_floor_plan_file_name} (ID: ${id})`);

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
      fileStream.on("close", () => {
        fs.unlinkSync(imagePath);
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error(`❌ Error fetching annotated image (ID: ${id}):`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/properties/:developerId", async (req, res) => {
  const { developerId } = req.params;

  if (!developerId || isNaN(developerId)) {
    return res.status(400).json({ error: "Invalid developer ID." });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const query = `
      SELECT 
        property_id, project_name, apartment_type, carpet_area, development_stage, image_url
      FROM Properties
      WHERE developer_id = @developerId
    `;
    const result = await pool.request().input("developerId", sql.Int, developerId).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No properties found." });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/download/:id", async (req, res) => {
  try {
    const { id, floor_plan_file_name, floor_plan_file_data} = await getPdfById(req.params.id);
    if (!floor_plan_file_data) {
      return res.status(404).send("File not found.");
    }

    res.setHeader("Content-Disposition", `inline; filename="${floor_plan_file_name}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", floor_plan_file_data.length);

    console.log(`✅ Sending PDF: ${floor_plan_file_name} (ID: ${id})`);
    res.send(floor_plan_file_data);
  } catch (error) {
    console.error(`❌ Error fetching PDF (ID: ${req.params.id}):`, error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/brochure/:id", async (req, res) => {
  try {
    const { id, brochure_file_name, brochure_file_data} = await getBrochureById(req.params.id);
    if (!brochure_file_data) {
      return res.status(404).send("File not found.");
    }

    res.setHeader("Content-Disposition", `inline; filename="${brochure_file_name}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", brochure_file_data.length);

    console.log(`✅ Sending PDF: ${brochure_file_name} (ID: ${id})`);
    res.send(brochure_file_data);
  } catch (error) {
    console.error(`❌ Error fetching PDF (ID: ${req.params.id}):`, error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.get("/properties/:id", async (req, res) => {
  let { id } = req.params;
  id = parseInt(id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Property ID format" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT property_id AS id, project_name, apartment_type, carpet_area, development_stage, image_url FROM Properties WHERE property_id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user-properties/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT 
          p.property_id AS id, 
          p.project_name, 
          p.apartment_type, 
          p.carpet_area, 
          p.development_stage, 
          p.image_url
        FROM Properties p
        INNER JOIN UserPropertyMapping upm ON p.property_id = upm.property_id
        WHERE upm.user_id = @userId
      `);

    if (result.recordset.length === 0) {
      console.warn(`⚠️ No properties found for user ${userId}`);
      return res.status(404).json({ message: "No properties found for this user." });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching user properties:", error);
    res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
});

app.get("/download-property/:userId/:propertyId/:fileType", async (req, res) => {
  const { userId, propertyId, fileType } = req.params;
  console.log(`📡 Open request received for user: ${userId}, property: ${propertyId}, fileType: ${fileType}`);

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(`
        SELECT 
          ${fileType === "floorplan" ? "floor_plan_file_name, floor_plan_file_data" : "brochure_file_name, brochure_file_data"}
        FROM Properties 
        WHERE property_id = @propertyId
      `);

    if (result.recordset.length === 0) {
      console.error("❌ No file found for this property.");
      return res.status(404).json({ message: "File not found." });
    }

    const file = result.recordset[0];
    const fileName = fileType === "floorplan" ? file.floor_plan_file_name : file.brochure_file_name;
    const fileData = fileType === "floorplan" ? file.floor_plan_file_data : file.brochure_file_data;

    if (!fileData) {
      console.error("❌ File data is missing or corrupted.");
      return res.status(400).json({ message: "File data is missing or corrupted." });
    }

    res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(fileData);
  } catch (error) {
    console.error("❌ Error retrieving file:", error);
    res.status(500).json({ message: "Server error while retrieving file." });
  }
});

app.get("/api/suggestions", async (req, res) => {
  const { propertyId } = req.query;

  if (!propertyId) {
    return res.status(400).json({ message: "Missing propertyId" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(`
        SELECT 
          ps.id,
          ps.suggestion_text AS suggestion,
          ps.likes,
          ps.dislikes,
          FORMAT(COALESCE(ps.created_at, GETDATE()), 'dd/MM/yyyy') AS created_at,
          COALESCE(ps.status, 'No action taken') AS status,
          u.full_name AS submitter
        FROM PropertySuggestions ps
        LEFT JOIN Users u ON ps.user_id = u.user_id
        WHERE ps.property_id = @propertyId
        ORDER BY ps.id DESC
      `);

    console.log("✅ Suggestions fetched:", result.recordset);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/get-user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT full_name FROM Users WHERE user_id = @userId");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/api/vote", async (req, res) => {
  const { userId, suggestionId, voteType } = req.body;

  console.log("📩 Received Vote API Request:", req.body);

  if (!userId || !suggestionId || !voteType) {
    console.error("❌ Missing required fields:", { userId, suggestionId, voteType });
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const result = await dbOperation.voteOnSuggestion(userId, suggestionId, voteType);
    res.json(result);
  } catch (error) {
    console.error("❌ Vote API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/add-suggestion", async (req, res) => {
  const { property_id, user_id, suggestion_text } = req.body;
  if (!property_id || !user_id || !suggestion_text) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  const result = await dbOperation.insertSuggestion(property_id, user_id, suggestion_text);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
});

app.get("/api/floorplan/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(`
        SELECT project_name, floor_plan_file_name, floor_plan_file_data 
        FROM Properties 
        WHERE property_id = @propertyId
      `);

    if (result.recordset.length === 0 || !result.recordset[0].floor_plan_file_data) {
      return res.status(404).json({ message: "Floor plan not found" });
    }
    const { project_name, floor_plan_file_name, floor_plan_file_data } = result.recordset[0];
    const pdfPath = path.join(TEMP_IMAGE_DIR, `${propertyId}.pdf`);
    fs.writeFileSync(pdfPath, floor_plan_file_data);
    const opts = { format: "jpeg", out_dir: TEMP_IMAGE_DIR, out_prefix: propertyId, page: 1 };
    await poppler.convert(pdfPath, opts);
    res.json({ 
      propertyName: project_name,
      imageUrl: `/temp_images/${propertyId}-1.jpg` 
    });

  } catch (error){
    console.error("❌ Error fetching floor plan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use("/temp_images", express.static(TEMP_IMAGE_DIR));

app.post("/save-annotation", upload.single("file"), async (req, res) => {
  try {
    const { propertyId, userId } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    let pool = await sql.connect(dbConfig);

    const annotationQuery = `
      MERGE INTO Annotations AS target
      USING (SELECT @userId AS user_id, @propertyId AS property_id) AS source
      ON target.user_id = source.user_id AND target.property_id = source.property_id
      WHEN MATCHED THEN
          UPDATE SET 
              annotated_file_name = @fileName, 
              annotated_file_data = @fileData,
              annotation_timestamp = GETDATE()  -- Updates timestamp
      WHEN NOT MATCHED THEN
          INSERT (user_id, property_id, annotated_file_name, annotated_file_data, annotation_timestamp)
          VALUES (@userId, @propertyId, @fileName, @fileData, GETDATE());
    `;

    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("propertyId", sql.Int, propertyId)
      .input("fileName", sql.VarChar, fileName)
      .input("fileData", sql.VarBinary, fileBuffer)
      .query(annotationQuery);

    res.status(200).json({ message: "Annotation saved updated successfully!" });
  } catch (error) {
    console.error("Error saving annotation and updating properties table:", error);
    res.status(500).json({ message: "Error saving annotation and updating properties table" });
  }
});

app.get("/api/dev/get-user/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    let pool = await sql.connect(dbConfig);

    const query = "SELECT user_id FROM UserPropertyMapping WHERE property_id = @propertyId";
    const result = await pool.request().input("propertyId", sql.Int, propertyId).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No users found for this property" });
    }

    res.json({ users: result.recordset });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/dev/user-details/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let pool = await sql.connect(dbConfig);

    const query = "SELECT full_name FROM Users WHERE user_id = @userId";
    const result = await pool.request().input("userId", sql.Int, userId).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User details not found" });
    }
    res.json({ full_name: result.recordset[0].full_name });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/dev/suggestions/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    let pool = await sql.connect(dbConfig);

    const query = `
        WITH UniqueSuggestions AS (
          SELECT DISTINCT 
              ps.id, 
              ps.suggestion_text, 
              ps.likes, 
              ps.dislikes, 
              FORMAT(COALESCE(ps.created_at, GETDATE()), 'dd/MM/yyyy') AS created_at, 
              ps.user_id,
              COALESCE(u.full_name, 'Anonymous') AS full_name
          FROM PropertySuggestions ps
          LEFT JOIN Users u ON ps.user_id = u.user_id
          WHERE ps.property_id = @propertyId
      )
      SELECT * FROM UniqueSuggestions
      ORDER BY TRY_CONVERT(DATE, created_at, 103) DESC;
    `;

    const result = await pool.request().input("propertyId", sql.Int, propertyId).query(query);
    
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/update-status", async (req, res) => {
  const { suggestionId, status } = req.body;

  if (!suggestionId || !status) {
    return res.status(400).json({ message: "Missing suggestionId or status" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("suggestionId", sql.Int, suggestionId)
      .input("status", sql.NVarChar(50), status)
      .query(`
        UPDATE PropertySuggestions
        SET status = @status
        WHERE id = @suggestionId
      `);

    console.log(`✅ Status updated for suggestion ID: ${suggestionId} → ${status}`);
    res.status(200).json({ success: true, message: "Status updated successfully." });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/timeline/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    return res.status(400).json({ message: "Missing propertyId" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(`
          SELECT property_name, date, task, completed 
          FROM (
              SELECT 
                  p.project_name AS property_name,
                  COALESCE(FORMAT(planning_permit_date, 'dd/MM/yyyy'), 'Date Not Available') AS date, 
                  'Planning and Permit' AS task, 
                  planning_permit_status AS completed
              FROM PropertyConstructionStatus pcs 
              JOIN Properties p ON pcs.property_id = p.property_id
              WHERE pcs.property_id = @propertyId
          
              UNION ALL
          
              SELECT 
                  p.project_name,
                  COALESCE(FORMAT(site_preparation_date, 'dd/MM/yyyy'), 'Date Not Available'), 
                  'Site Preparation and Foundational Work', 
                  site_preparation_status
              FROM PropertyConstructionStatus pcs 
              JOIN Properties p ON pcs.property_id = p.property_id
              WHERE pcs.property_id = @propertyId
          
              UNION ALL
          
              SELECT 
                  p.project_name,
                  COALESCE(FORMAT(structural_utility_date, 'dd/MM/yyyy'), 'Date Not Available'), 
                  'Structural and Utility Installation', 
                  structural_utility_status
              FROM PropertyConstructionStatus pcs 
              JOIN Properties p ON pcs.property_id = p.property_id
              WHERE pcs.property_id = @propertyId
          
              UNION ALL
          
              SELECT 
                  p.project_name,
                  COALESCE(FORMAT(interior_exterior_date, 'dd/MM/yyyy'), 'Date Not Available'), 
                  'Interior and Exterior Finishing', 
                  interior_exterior_status
              FROM PropertyConstructionStatus pcs 
              JOIN Properties p ON pcs.property_id = p.property_id
              WHERE pcs.property_id = @propertyId
          
              UNION ALL
          
              SELECT 
                  p.project_name,
                  COALESCE(FORMAT(possession_handover_date, 'dd/MM/yyyy'), 'Date Not Available'), 
                  'Possession and Handover', 
                  possession_handover_status
              FROM PropertyConstructionStatus pcs 
              JOIN Properties p ON pcs.property_id = p.property_id
              WHERE pcs.property_id = @propertyId
          
          ) AS TimelineData
          ORDER BY TRY_CONVERT(DATE, date, 103) ASC;
      `);

      res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching timeline data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/get-project-name", async (req, res) => {
  const { propertyId } = req.query;

  if (!propertyId) {
    return res.status(400).json({ message: "Missing property ID" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(`SELECT project_name FROM Properties WHERE property_id = @propertyId`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project_name: result.recordset[0].project_name });
  } catch (error) {
    console.error("❌ Error fetching project name:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/update-timeline", async (req, res) => {
  const { propertyId, ...updates } = req.body;

  if (!propertyId) {
    return res.status(400).json({ message: "Missing property ID" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const checkQuery = `
      SELECT COUNT(*) AS count FROM PropertyConstructionStatus WHERE property_id = @propertyId`;
    const checkResult = await pool.request()
      .input("propertyId", sql.Int, propertyId)
      .query(checkQuery);

    const exists = checkResult.recordset[0].count > 0;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const request = pool.request().input("propertyId", sql.Int, propertyId);
    Object.entries(updates).forEach(([key, value]) => {
      request.input(key, typeof value === "number" ? sql.Int : sql.NVarChar, value);
    });
    let query;
    if (exists) {
      const updateFields = Object.keys(updates)
        .map((key) => `${key} = @${key}`)
        .join(", ");
      
      query = `UPDATE PropertyConstructionStatus SET ${updateFields} WHERE property_id = @propertyId`;
    } else {
      const columns = Object.keys(updates).concat("property_id").join(", ");
      const values = Object.keys(updates).map((key) => `@${key}`).concat("@propertyId").join(", ");
      
      query = `INSERT INTO PropertyConstructionStatus (${columns}) VALUES (${values})`;
    }

    await request.query(query);
    res.status(200).json({ message: exists ? "Timeline updated successfully!" : "New timeline entry created!" });

  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/api/developer/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT full_name, email, mobile_number FROM developer WHERE developer_id = @id");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "Developer not found" });
    }
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Server error");
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT full_name, email, mobile_number FROM Users WHERE user_id = @id");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Server error");
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

app.post("/api/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!message) return res.status(400).json({ error: "Message is required" });

    let botResponse = "";

    const purchasedKeywords = ["properties bought by me", "my purchased properties", "houses I own", "my properties"];
    const isPurchasedQuery = purchasedKeywords.some((keyword) => message.toLowerCase().includes(keyword));

    if (isPurchasedQuery) {
      const userProperties = await dbOperation.getUserProperties(userId);

      if (userProperties.length > 0) {
        const purchasedList = userProperties.map((p) => `${p.project_name} (${p.apartment_type})`).join(", ");
        botResponse = `You have purchased the following properties: ${purchasedList}.`;
      } else {
        botResponse = "You have not purchased any properties yet.";
      }

      return res.json({ reply: botResponse });
    }

    const availableKeywords = ["available properties", "properties for sale", "new properties", "properties available"];
    const isAvailableQuery = availableKeywords.some((keyword) => message.toLowerCase().includes(keyword));

    if (isAvailableQuery) {
      const allProperties = await dbOperation.getAvailableProperties();

      if (allProperties.length > 0) {
        const availableList = allProperties.map((p) => `${p.project_name} (${p.apartment_type})`).join(", ");
        botResponse = `Available properties: ${availableList}.`;
      } else {
        botResponse = "No new properties available right now.";
      }

      return res.json({ reply: botResponse });
    }

    const requestPayload = {
      contents: [{ role: "user", parts: [{ text: message }] }],
    };

    const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, requestPayload);
    console.log("🔹 Gemini API Response:", response.data);

    botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm unable to respond right now.";
    botResponse = botResponse.split(". ").slice(0, 2).join(". "); // Limit response length

    res.json({ reply: botResponse });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI service unavailable." });
  }
});

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await sql.connect(dbConfig);

    const query = `
      -- Fetch suggestions added by other users (excluding logged-in user)
      SELECT 
        'A new suggestion "' + ps.suggestion_text + '" was added by ' + u.full_name AS message,
        u.full_name AS senderName
      FROM PropertySuggestions ps
      LEFT JOIN Users u ON ps.user_id = u.user_id
      WHERE ps.user_id <> @userId  -- Exclude logged-in user's own suggestions

      UNION ALL

      -- Fetch property timeline updates by developers
      SELECT 
        'Property timeline updated: ' + pcs.planning_permit_status AS message,
        d.full_name AS senderName
      FROM PropertyConstructionStatus pcs
      LEFT JOIN Developer d ON pcs.property_id = d.developer_id

      UNION ALL

      -- Fetch developer updates on suggestions (status change)
      SELECT 
        'Your suggestion "' + ps.suggestion_text + '" was ' + ps.status AS message,
        d.full_name AS senderName
      FROM PropertySuggestions ps
      LEFT JOIN Developer d ON ps.property_id = d.developer_id
      WHERE ps.user_id = @userId AND ps.status IS NOT NULL
    `;

    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.get("/api/developer/:developerId", async (req, res) => {
  try {
    const { developerId } = req.params;
    const pool = await sql.connect(dbConfig);
    
    const result = await pool.request()
      .input("developerId", sql.Int, developerId)
      .query("SELECT full_name, email FROM Developer WHERE developer_id = @developerId");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Developer not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("❌ Error fetching developer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch Developer Notifications
app.get("/api/notifications/developer/:developerId", async (req, res) => {
  try {
    const { developerId } = req.params;
    const pool = await sql.connect(dbConfig);

    const query = `
      -- Notify developers when a user adds a new suggestion
      SELECT 
        'New suggestion "' + ps.suggestion_text + '" added by ' + u.full_name AS message,
        u.full_name AS senderName
      FROM PropertySuggestions ps
      LEFT JOIN Users u ON ps.user_id = u.user_id
      WHERE ps.property_id IN (SELECT property_id FROM Developer WHERE developer_id = @developerId)

      UNION ALL

      -- Notify developers when another developer updates the status of a suggestion
      SELECT 
        'Suggestion "' + ps.suggestion_text + '" was ' + ps.status + ' by ' + d.full_name AS message,
        d.full_name AS senderName
      FROM PropertySuggestions ps
      LEFT JOIN Developer d ON ps.property_id = d.developer_id
      WHERE d.developer_id <> @developerId AND ps.status IS NOT NULL

      UNION ALL

      -- Notify developers when another developer updates the property timeline
      SELECT 
        'Timeline updated: ' + pcs.planning_permit_status + ' by ' + d.full_name AS message,
        d.full_name AS senderName
      FROM PropertyConstructionStatus pcs
      LEFT JOIN Developer d ON pcs.property_id = d.developer_id
      WHERE d.developer_id <> @developerId
    `;

    const result = await pool.request()
      .input("developerId", sql.Int, developerId)
      .query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching developer notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
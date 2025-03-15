require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbOperation = require('./dbFiles/dbOperation');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const sql = require("mssql");
const { fetchProjects, getPdfById, getSuggestions } = require("./dbFiles/dbOperation");
const dbConfig = require("./dbFiles/dbConfig");
const fs = require("fs-extra");
const path = require("path");
const poppler = require("pdf-poppler");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const PDFDocument = require("pdfkit");

const TEMP_IMAGE_DIR = path.join(__dirname, "temp_images");
// Ensure the temp directory exists
fs.ensureDirSync(TEMP_IMAGE_DIR);

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
          return done(null, { email, user_id: developer.developer_id, role: "developer" });
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

    if (!req.user || !req.user.user_id) {
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
        SELECT floor_plan_file_name, floor_plan_file_data 
        FROM Properties 
        WHERE property_id = @propertyId
      `);

    if (result.recordset.length === 0 || !result.recordset[0].floor_plan_file_data) {
      return res.status(404).json({ message: "Floor plan not found" });
    }
    const { floor_plan_file_name, floor_plan_file_data } = result.recordset[0];
    const pdfPath = path.join(TEMP_IMAGE_DIR, `${propertyId}.pdf`);
    fs.writeFileSync(pdfPath, floor_plan_file_data);
    const opts = { format: "jpeg", out_dir: TEMP_IMAGE_DIR, out_prefix: propertyId, page: 1 };
    await poppler.convert(pdfPath, opts);
    res.json({ imageUrl: `/temp_images/${propertyId}-1.jpg` });

  } catch (error) {
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
      INSERT INTO Annotations (user_id, property_id, annotated_file_name, annotated_file_data) 
      VALUES (@userId, @propertyId, @fileName, @fileData);
    `;

    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("propertyId", sql.Int, propertyId)
      .input("fileName", sql.VarChar, fileName)
      .input("fileData", sql.VarBinary, fileBuffer)
      .query(annotationQuery);

    const updatePropertyQuery = `
      UPDATE Properties 
      SET annotated_floor_plan_file_name = @fileName, 
          annotated_floor_plan_file_data = @fileData
      WHERE property_id = @propertyId;
    `;

    await pool
      .request()
      .input("fileName", sql.VarChar, fileName)
      .input("fileData", sql.VarBinary, fileBuffer)
      .input("propertyId", sql.Int, propertyId)
      .query(updatePropertyQuery);

    res.status(200).json({ message: "Annotation saved and Properties table updated successfully!" });
  } catch (error) {
    console.error("Error saving annotation and updating properties table:", error);
    res.status(500).json({ message: "Error saving annotation and updating properties table" });
  }
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
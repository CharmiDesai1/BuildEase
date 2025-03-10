const config = require('./dbConfig');
const dbConfig = require("./dbConfig");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const saltRounds = 10;

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

const getDevelopers = async () => {
    try {
        await poolConnect;
        let developers = await pool.request().query("SELECT * FROM Developer");
        return developers.recordset;
    } catch (error) {
        console.error("Get Developers Error:", error);
        throw error;
    }
};

const insertDeveloper = async (fullName, email, password) => {
    try {
        await poolConnect;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let result = await pool.request()
            .input('full_name', sql.VarChar(100), fullName)
            .input('email', sql.VarChar(100), email)
            .input('password_hash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`INSERT INTO Developer (full_name, email, password_hash) VALUES (@full_name, @email, @password_hash)`);
        return result;
    } catch (error) {
        console.error('Insert Developer Error:', error);
        throw error;
    }
};

const googleLogin = async (displayName, email) => {
    try {
        await poolConnect;
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

        await pool.request()
            .input('full_name', sql.VarChar(100), displayName)
            .input('email', sql.VarChar(100), email)
            .input('password_hash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`
                IF NOT EXISTS (SELECT * FROM Developer WHERE email = @email)
                BEGIN
                    INSERT INTO Developer (full_name, email, password_hash)
                    VALUES (@full_name, @email, @password_hash)
                END
            `);

        return { message: "Google user registered successfully" };
    } catch (error) {
        console.error('Google Login Error:', error);
        throw error;
    }
};

const loginDeveloper = async (email, password) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('email', sql.VarChar(100), email)
            .query('SELECT * FROM Developer WHERE email = @email');

        if (result.recordset.length === 0) {
            return { success: false, message: "Invalid user" };
        }

        const developer = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, developer.password_hash);

        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }

        return { success: true, developer };
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

const getUsers = async () => {
    try {
        await poolConnect;
        let users = await pool.request().query("SELECT * FROM Users");
        return users.recordset;
    } catch (error) {
        console.error("Get Users Error:", error);
        throw error;
    }
};

const insertUser = async (fullName, email, password) => {
    try {
        await poolConnect;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let result = await pool.request()
            .input('full_name', sql.VarChar(100), fullName)
            .input('email', sql.VarChar(100), email)
            .input('password_hash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`INSERT INTO Users (full_name, email, password_hash) VALUES (@full_name, @email, @password_hash)`);
        return result;
    } catch (error) {
        console.error('Insert User Error:', error);
        throw error;
    }
};

const googleLoginUser = async (displayName, email) => {
    try {
        await poolConnect;
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

        await pool.request()
            .input('full_name', sql.VarChar(100), displayName)
            .input('email', sql.VarChar(100), email)
            .input('password_hash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`
                IF NOT EXISTS (SELECT * FROM Users WHERE email = @email)
                BEGIN
                    INSERT INTO Users (full_name, email, password_hash)
                    VALUES (@full_name, @email, @password_hash)
                END
            `);

        return { message: "Google user registered successfully" };
    } catch (error) {
        console.error('Google Login Error:', error);
        throw error;
    }
};

const loginUser = async (email, password) => {
    console.log("📡 loginUser function called with:", email);

    try {
        await poolConnect; // ✅ Ensure the connection is established
        const result = await pool
            .request()
            .input("email", sql.VarChar(100), email)
            .query("SELECT * FROM Users WHERE email = @email");

        console.log("✅ Query executed. Result:", result.recordset);

        if (!result.recordset.length) {
            console.log("❌ No user found for:", email);
            return { success: false, message: "Invalid email or password" };
        }

        const user = result.recordset[0];
        console.log("✅ Found user:", user);

        if (!user.user_id) {
            console.error("❌ user_id is missing in database!");
            return { success: false, message: "User ID missing in database record" };
        }

        return { success: true, user };

    } catch (error) {
        console.error("❌ Database error:", error);
        return { success: false, message: "Database error", error };
    }
};

const getProjects = async () => {
    try {
        await poolConnect;
        let result = await pool.request().query("SELECT * FROM Projects");
        return result.recordset;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

async function fetchProjects() {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query("SELECT id, project_name, apartment_type, carpet_area, development_stage, rating, image_url FROM PdfDocuments");
    return result.recordset;
  }
  
  async function getPdfById(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid PDF ID.");
    }
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT id, file_name, file_data FROM PdfDocuments WHERE id = @id");
  
    if (result.recordset.length === 0) {
      throw new Error("PDF not found.");
    }
    return result.recordset[0];
  }

  async function getUserProperties(userId) {
    if (!userId || isNaN(userId)) {
      throw new Error("Invalid User ID.");
    }
  
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT id, project_name, apartment_type, carpet_area, development_stage, image_url, 
               brochure_file_name, floor_plan_file_name
        FROM UserPropertyDocuments 
        WHERE user_id = @userId
      `);
    return result.recordset;
  }
  
  async function getPropertyFile(userId, propertyId) {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("propertyId", sql.Int, propertyId)
      .query(`
        SELECT brochure_file_name, brochure_file_data, floor_plan_file_name, floor_plan_file_data
        FROM UserPropertyDocuments 
        WHERE user_id = @userId AND id = @propertyId
      `);
    if (result.recordset.length === 0) {
      throw new Error("File not found.");
    }
    return result.recordset[0];
  }
  
module.exports = {
    getDevelopers, insertDeveloper, googleLogin, loginDeveloper, getProjects, getUsers, insertUser,
    googleLoginUser, loginUser, fetchProjects, getPdfById, getUserProperties, getPropertyFile
};
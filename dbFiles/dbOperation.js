const config = require('./dbConfig');
const bcrypt = require("bcrypt");
const sql = require("mssql");
const saltRounds = 10;

// Establish Database Connection
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
    try {
        await poolConnect;
        const result = await pool.request()
            .input('email', sql.VarChar(100), email)
            .query('SELECT * FROM Users WHERE email = @email');

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

module.exports = {
    getDevelopers,
    insertDeveloper,
    googleLogin,
    loginDeveloper,
    getProjects,
    getUsers,
    insertUser,
    googleLoginUser,
    loginUser
};
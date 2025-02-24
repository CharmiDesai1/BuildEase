const config = require('./dbConfig');
const bcrypt = require("bcrypt");
const sql = require("mssql");
const saltRounds = 10;

const getDevelopers = async() => {
    try {
        let pool = await sql.connect(config);
        let developers = pool.request().query("SELECT * from Developer")
        console.log(developers);
        return developers;
    }
    catch(error){
        console.log(error);
    }
}

const insertDeveloper = async (fullName, email, password) => {
    try {
        console.log("Inserting Developer Data: ", { fullName, email, password}); // Add log
        let pool = await sql.connect(config);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let result = await pool.request()
            .input('full_name', sql.VarChar(100), fullName)
            .input('email', sql.VarChar(100), email)
            .input('password_hash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`
                INSERT INTO Developer (full_name, email, password_hash)
                VALUES (@full_name, @email, @password_hash)`);
        console.log('Developer inserted:', result);
        return result;
    } catch (error) {
        console.log('Insert Error:', error);
    }
}

module.exports = {
    getDevelopers,
    insertDeveloper
};

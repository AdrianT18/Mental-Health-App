const pool = require("../../../config/database");
const bcrypt = require("bcrypt");

module.exports = {
    // Create a new user
    create: async (data) => {
        try {
            const [rows, fields] = await pool.query(
                `INSERT INTO user (firstname, lastname, username, email, password) VALUES (?,?,?,?,?)`,
                [
                    // data to insert
                    data.firstname,
                    data.lastname,
                    data.username,
                    data.email,
                    data.password
                ],
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },
    // Get a user by id
    getUserByUserId: async (username) => {
        // tries to find a user with the given username
        try {
            const [rows, fields] = await pool.query(
                `select * from user where username = ?`,
                [username],
            );
            return rows[0];
        } catch (error) {
            throw error
        }
    },
    // Check a users email
    checkUserEmail: async (email) => {
        // tries to find a user with the given email
        try {
            const [rows, fields] = await pool.query(
                `select * from user where email = ?`,
                [email],
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    // update a users password
    updatePassword: async (email, password) => {
        try {
            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            // Update user password with a new hashed password
            await pool.query(`UPDATE user SET password = ? WHERE email = ?`, [hashedPassword, email]);
        } catch (error) {
            throw error;
        }
    }
};

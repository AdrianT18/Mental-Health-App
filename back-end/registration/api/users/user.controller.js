const {create, getUserByUserId, checkUserEmail, updatePassword} = require("./user.service");
const {genSaltSync, hashSync} = require("bcrypt");
const {sign, verify} = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

// Create transporter
// The transporter is used to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.RESET_EMAIL,
        pass: process.env.RESET_PASSWORD
    }
});

module.exports = {
    // Create a new user
    createUser: async (req, res) => {
        // Get the body of the request
        const body = req.body;
        // Generate a salt to hash the password
        const salt = genSaltSync(10);
        // Hash the password
        body.password = hashSync(body.password, salt);
        // Create a new user
        try {
            // Create a new user in the database based on the body of the request
            const results = await create(body);
            // Return the results if successful
            return res.status(200).json({
                success: 1,
                requestBody: body,
                data: results,
            });
        } catch (error) {
            // Return an error if unsuccessful
            console.error(error);
            return res.status(500).json({
                success: 0,
                message: "Server error",
            });
        }
    },
    // Login a user
    login: async (req, res) => {
        // Get the body of the request specifying the username and password
        const {username, password} = req.body;
        // Check if the username and password are valid
        try {
            // Get the user from the database
            const user = await getUserByUserId(username);
            // Check if the user exists and if the user does not exist, return an error
            if (!user) {
                // Return an error if the user does not exist
                return res.status(401).json({
                    auth: false,
                    success: 0,
                    message: "Invalid username or password",
                });
            }
            // Check if password is valid by comparing the password in the database with the password in the request
            const isPasswordValid = await bcrypt.compare(password, user.password);
            // If the password is not valid, return an error
            if (!isPasswordValid) {
                return res.status(401).json({
                    auth: false,
                    success: 0,
                    message: "Invalid username or password",
                });
            }
            // If the password is valid, return the user
            user.password = undefined;
            // Create a token to be used for authentication
            const jsontoken = sign({result: user}, process.env.KEY, {
                // Set the token to expire in 120 minutes
                expiresIn: "120m",
            });
            // Return the token if successful and the user if successful
            return res.status(200).json({
                auth: true,
                token: jsontoken,
            });
        } catch (error) {
            // Return an error if unsuccessful
            console.error(error);
            return res.status(500).json({
                auth: false,
                success: 0,
                message: "Server error",
            });
        }
    },
    // Check if the email exists
    checkUserEmail: async (req, res) => {
        // Get the email from the request
        const email = req.body.email;
        // Check if the email exists
        try {
            // Check if the email exists in the database
            const user = await checkUserEmail(email);
            // If the email does not exist, return an error
            if (!user) {
                return res.status(404).json({
                    success: 0,
                    message: "Email not found"
                });
            }

            // If the email exists, create a token and send an email to the user
            const secret = process.env.KEY;
            // Create a token to be used for authentication in the reset password link
            const emailToken = sign({email: email}, secret, {
                expiresIn: '2m',
            });
            // Create a link to be sent to the user
            const link = `http://localhost:3000/api/users/reset-password/${emailToken}`;
            // Send an email to the user with the link to reset the password
            const mailOptions = {
                from: 'group49brunel@gmail.com',
                to: email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${link}">${link}</a>`,
            };
            // Send the email to the user and return a success message if successful and an error message if unsuccessful
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return res.json({
                        success: 0,
                        message: "Error sending email"
                    });
                }
                return res.json({
                    success: 1,
                    message: "Email sent",
                    emailUrl: mailOptions.html
                });
            });
        } catch (error) {
            return res.json({
                success: 0,
                message: "Error checking email"
            });
        }
    },
    // Reset the password
    resetPassword: async (req, res) => {
        // Get the token from the request and verify the token
        const emailToken = req.params.emailToken;

        try {
            // Retrieve user from the database using their email
            const decodedEmail = verify(emailToken, process.env.KEY);
            console.log('decodedEmail:', decodedEmail); // Log the decoded email
            const user = await checkUserEmail(decodedEmail.email);

            if (!user) {
                return res.json({
                    success: 0,
                    message: "User not found"
                });
            }

            // Generate the secret using user's password and KEY
            const secret = process.env.KEY;
            console.log('secret:', secret); // Log the secret
            // Verify the token with the secret
            const decoded = verify(emailToken, secret);
            console.log('decoded:', decoded); // Log the decoded token

            // If the token is invalid, return an error
            if (!decoded) {
                return res.json({
                    success: 0,
                    message: "Invalid token"
                });
            }

            // If the token is valid, update the password
            const email = decoded.email;
            // Get the new password from the request
            const newPassword = req.body.password;

            // Update the password
            await updatePassword(email, newPassword);

            // Return a success message if successful
            return res.json({
                success: 1,
                message: "Password reset successful",
            });
        } catch (error) {
            console.log('Error:', error);
            // Return an error if unsuccessful
            return res.status(500).json({
                success: 0,
                message: "Error resetting password",
                error: error
            });
        }
    }
};
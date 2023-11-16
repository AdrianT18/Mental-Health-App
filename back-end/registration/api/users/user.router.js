const { createUser, login,checkUserEmail, resetPassword} = require("./user.controller")
const router = require("express").Router();

// This is the router for the user registration, login, and password reset
router.post("/", createUser)
router.post("/login", login)
router.post("/checkingEmail", checkUserEmail)
router.patch("/reset-password/:emailToken", resetPassword)
module.exports = router;
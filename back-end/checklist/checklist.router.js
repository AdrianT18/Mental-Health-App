// Importing the controller
const { createTask, getTasks, updateTask, deleteTask, editTask } = require("./checklist.controller")
// Importing the router
const router = require("express").Router();
// Importing the token validation
const {checkToken} = require("../registration/auth/token_validation")
// Creating the routes

// Routes which require a token to be passed in the header of the request to be accessed successfully
// Each route has /checklist prepended to it
router.post("/addTask",checkToken, createTask)
router.get("/getTask", checkToken, getTasks)
router.put("/updateTask/:id", checkToken, updateTask);
router.delete("/deleteTask/:id", checkToken, deleteTask);
router.put("/editTask/:id", checkToken, editTask);
module.exports = router;
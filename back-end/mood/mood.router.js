const {insertMood} = require("./mood.controller")
const router = require("express").Router()

router.post("/", insertMood)

module.exports = router
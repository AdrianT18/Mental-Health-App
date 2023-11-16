const{ getConditionResponse } = require("./conditionSearch.controller")  //importing function from controller to assign route
const router = require("express").Router()

router.get("/", getConditionResponse); //route is assigned and then allocated in databaseMain.js file to generate the API url
module.exports = router;
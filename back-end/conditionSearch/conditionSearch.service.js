const pool = require("../config/database")
const express = require("express")
module.exports = {

    getCondition: () => {
        return pool.query("SELECT * FROM conditiondata") //pool selects data from database
        .then(([rows]) => {   //destructured array assignment so it hides metadata upon api calls
            return rows;
        })
        .catch((err) => {
            console.log(err);  //return error if connection is unsuccessful
            throw err;
        })
},


};

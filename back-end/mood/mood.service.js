const pool = require("../config/database")
const e = require("express");

module.exports = {

postMood: (data) => {
        return pool.query("INSERT INTO moods (date, mood) VALUES (?, ?)", [
            data.date,
            data.mood
        ]) 
        .then((results) => {
            return results;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    }
}
const pool = require("../config/database")
const e = require("express")

module.exports = {
    getRepliesForPost: (id) =>{
        return pool.query(`SELECT * FROM replies WHERE postID = ? ORDER BY id DESC`,[id] )
            .then(([results]) =>{
                if(results.length === 0){
                    throw new Error ("No replies")
                }
                return results
            })
            .catch(error =>{
                throw error;
            })
    },

    deletePost: (id) => {
        return pool.query("DELETE FROM posts WHERE id = ?", [id])
        .then((results) => {
            return results;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    },

    replyToPost: (data) => {
        return pool.query("INSERT INTO replies (postID, date, body,postedBy) VALUES (?, ?, ?,?)",
        [data.id, data.date, data.body,data.postedBy])
        .then((results) => {
            return results;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    },

}
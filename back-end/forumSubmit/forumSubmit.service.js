/*This file exports an object with a single method named create. This method is used to insert a new row into the "posts table". The method takes two arguments: data and callback.
 The data parameter is an object that contains the data to be inserted into the posts table, and the callback parameter is a function that will be called after the database query has completed.
 This is called in the controller function, and both the data and callback are defined there.*/

const pool = require("../config/database")
const e = require("express");

module.exports = {

    createPost: (data) =>{
        return pool.query( // query inserts into db the given values.
            `INSERT INTO posts(title,content,datePosted,posterName) VALUES(?,?,?,?)`,
            [
                data.title,
                data.content,
                data.datePosted,
                data.posterName
            ]
        )
            .then(result => {  // if promise is resolved, return the result
                return result;
            })
            .catch(error => {  // If there's an error, throw it
                throw error;
            });
    },

    getAllPosts: () => {
        return pool.query("SELECT title, posterName, datePosted, id FROM posts ORDER BY id DESC")
        .then((results) => {
            return results;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    },

    getPostByID: (id) => {
        return pool.query(`SELECT * FROM posts WHERE id = ?`, [id]) // pool.query returns a promise that resolves with the query results
            .then(([results]) => { // callback passed to `then` method receives query results
                if(results.length === 0) //check if the result is empty, this would mean that the ID is not found
                    throw new Error("No result found")
                return results[0];
            })
            .catch(error => { // callback passed to `catch` method receives any other error that occurs. Errors are handled by the controller getPost "catch" statement
                throw error;
            });
    },

    getUserIDForum: async (userId) => { // Gets current logged-in user's username via sql lookup of their ID., used in forum to get name of user submitting post.
        try {
            const [rows, fields] = await pool.query(
                `select username from user where id = ?`, [userId]
            )
            return rows[0].username;
        } catch (error) {
            throw error
        }
    }

    /* Non-working callback-based version of getPostByID service  It is callback based and therefore incompatible with mysql2/promise
       getPostByID: (id,callback) => {
        console.log("passed id ",id)
        pool.query(`select * from posts where id = ?`,
            [id],
            (error,results) =>{
            if(error){
                callback(error)
            }
            return callback(null,results[0])
            }
        )
    }
};
     */
};
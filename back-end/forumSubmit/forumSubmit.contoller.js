/* route handler for API POST request to put forum post details into DB.
contains a single method with two arguments, the request object and the response object.
Takes the request body, containing the info needed to create a new forum post.
Then calls the createPost function in forumSubmit.service.js, which will attempt to insert the new forum post in the DB
 if this fails then a suitable error is returned. */

const {createPost, getAllPosts,getPostByID,getUserIDForum} = require("./forumSubmit.service")

module.exports = {
    createForumPost: (req, res) => {
        const data = req.body // Extract the data from the request body
        createPost(data) // calling the createPost service
            .then(result => { // if promise is resolved, return a json object with success code 1 and data from the result
                return res.status(200).json({
                    success: 1,
                    data: result
                })
            })
            .catch(error => {// If there's an error, log it. and return a json object with success code 0 and message
                console.log(error)
                return res.status(500).json({
                    success: 0,
                    message: "Cannot connect to database"
                })
            });
    },

    getForumPosts: (req, res) => {
        getAllPosts()
        .then((results) => {
            res.status(200).json({
                success: 1,
                data: results
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                    success: 0,
                    message: "Cannot connect to database"
            });
        });
    },

    getPost: (req,res) =>{
        const id = req.params.id // id extracted from request parameters
        getPostByID(id) // calling getPostByID service in forumSubmit.service, which returns a promise.
            .then(results => { // if promise is successful return json result
                return res.json({
                    success: 1,
                    data: results
                })
            })
            .catch(error => { // handling unsuccessful events
                console.log(error.message)
                if(error.message === "No result found"){
                    return res.json({success: 0, message: "This post ID does not exist"})
                }
                    return res.json({ success: 0, message: "Error while fetching data"})
            });
    },

    // API controller for getting username from ID
    getUsernameForum: async (req, res) => {
        const {user} = res.locals
        const username= await getUserIDForum(user.id)
        return res.json({
            data: username
        })
    }


    /* Non-Async version of the getPost controller. It is callback based and therefore incompatible with mysql2/promise
        getPost: (req,res) =>{
        const id = req.params.id
        console.log(id)
        getPostByID(id,(err,results) =>{
            if(err){
                console.log(err)
                return
            }
            if(!results){
                return res.json({
                    success:0,
                    message:"404 - Data not found"
                })
            }
            return res.json({
                success:1,
                data:results
            })
        })
    }
     */

}
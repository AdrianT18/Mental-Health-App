const {getRepliesForPost, deletePost, replyToPost} = require("./replies.service")

module.exports = {
    getReplies: (req,res) => {
        const postID = req.params.id
        getRepliesForPost(postID).then(result =>{
            return res.json({
                success:1,
                data: result
            })
        })
            .catch(error => {
                console.log(error.message)
                if(error.message === "No replies"){
                    return res.json({success:0,message:"No replies found for post"})
                }
                return res.json({success:0,message:"Unknown Error in fetching replies"})
            })
    },

    deletingPost: (req, res) => {
        const postID = req.params.id
        deletePost(postID).then(result => {
            return res.json({
                success: 1,
                data: result
            })
        })
            .catch(error => {
                console.log(error.message)
            })
    },

    replyPost: (req, res) => {
        const data = req.body
        replyToPost(data).then(result => {
            return res.json({
                success: 1,
                data: result
            })
        })
            .catch(error => {
                console.log(error.message)
            })
    }
}
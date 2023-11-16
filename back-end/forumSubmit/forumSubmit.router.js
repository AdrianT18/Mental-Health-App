const {createForumPost, getForumPosts,getPost,getUsernameForum} = require("./forumSubmit.contoller")
const router = require("express").Router()
const {checkToken} = require("../registration/auth/token_validation")

// checks users token before submitting post, a user must be logged into submit.
router.post("/",checkToken,createForumPost) // post route listening on path ".../", when a request is received here, createForumPost is called.
                                       // The exact path to call this API is defined in the databaseMain file where "app.use" is used to mount it at a specific path in the express server
router.get("/", getForumPosts)

router.get("/getPost/:id", getPost)

router.get("/getUser",checkToken,getUsernameForum) // get username route, checks token before proceeding.

module.exports = router


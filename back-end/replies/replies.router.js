const {getReplies, deletingPost, replyPost} = require("./replies.controller")
const router = require("express").Router()

router.get("/getRepliesFromPostID/:id",getReplies)
router.get("/deletePost/:id", deletingPost)
router.post("/replyPost/", replyPost)

module.exports = router
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')
const bp = require('body-parser')
// api router imports
const userRouter = require("./registration/api/users/user.router");
const forumSubmitRouter = require("./forumSubmit/forumSubmit.router");
const checklistRouter = require("./checklist/checklist.router");
const repliesRouter = require("./replies/replies.router")
const conditionSearchRouter = require("./conditionSearch/conditionSearch.router")
const moodRouter = require("./mood/mood.router")


app.use(cors());
app.use(express.json());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// api routes
app.use("/api/users", userRouter);
app.use("/api/forumPost", forumSubmitRouter);
app.use("/api/checklist", checklistRouter);
app.use("/api/replies",repliesRouter)
app.use("/api/conditiondata", conditionSearchRouter);
app.use("/api/moods", moodRouter)


app.listen(process.env.APP_PORT, ()=>{
    console.log("Server up and running on port: ", process.env.APP_PORT);
})

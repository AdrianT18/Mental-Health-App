const {postMood} = require("./mood.service")

module.exports = {

insertMood: (req, res) => {
        const data = req.body
        postMood(data)
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
}
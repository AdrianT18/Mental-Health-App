const {sendTask, getUserId, getUsersTasks, updateTask, deleteTask, editTask} = require("./checlist.service");

module.exports = {
    // Create a task
    createTask: async (req, res) => {
        // Get the body of the request and store it in a variable
        const body = req.body;
        // Get the user from the res.locals object
        const { user } = res.locals
        // Get the user id from the user object
        const userId = await getUserId(user.id)
        // Call the sendTask function from the checklist.service.js file
        sendTask({
            taskName: body.taskName,
            taskDescription: body.taskDescription,
            taskDeadline: body.taskDeadline,
            taskCompleted: body.taskCompleted,
            user_id: userId
        })
            .then(response => {
                // Return a response with a status code of 200 and a success message
                return res.status(200).json({
                    success: 1,
                    data: response
                });
            })
            .catch(error => {
                // If there is an error, log it to the console and return a response with a status code of 500 and a failure message
                console.log(error);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            });
    },
    // Get all tasks
    getTasks: async (req, res) => {
        const { user } = res.locals
        // Call the getUsersTasks function from the checklist.service.js file
        getUsersTasks(user.id)
            .then(response => {
                // Return a response with a status code of 200 and a success message
                return res.status(200).json({
                    success: 1,
                    data: response
                });
            })
            .catch(error => {
                // If there is an error, log it to the console and return a response with a status code of 500 and a failure message
                console.log(error);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            })
    },
    // Update a task
    updateTask: async (req, res) => {
        const body = req.body;
        const taskId = req.params.id;
        // Call the updateTask function from the checklist.service.js file
        updateTask(taskId, body)
            .then(response => {
                //
                return res.status(200).json({
                    success: 1,
                    data: response
                });
            })
            .catch(error => {
                console.log(error);
                // If there is an error, log it to the console and return a response with a status code of 500 and a failure message
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            });
    },
    // Delete a task
    deleteTask: async (req, res) => {
        const taskId = req.params.id;
        // Call the deleteTask function from the checklist.service.js file
        deleteTask(taskId)
            .then(response => {
                // Return a response with a status code of 200 and a success message
                return res.status(200).json({
                    success: 1,
                    data: response
                });
            })
            .catch(error => {
                // If there is an error, log it to the console and return a response with a status code of 500 and a failure message
                console.log(error);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            });
    },
    // Edit a task
    editTask: async (req, res) => {
        const body = req.body;
        const taskId = req.params.id;
        // Call the editTask function from the checklist.service.js file
        editTask(taskId, body)
            .then(response => {
                // Return a response with a status code of 200 and a success message
                return res.status(200).json({
                    success: 1,
                    data: response
                });
            })
            .catch(error => {
                // If there is an error, log it to the console and return a response with a status code of 500 and a failure message
                console.log(error);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            });
    }
};


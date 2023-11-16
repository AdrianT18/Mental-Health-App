const pool = require("../config/database")

module.exports = {
    // Get the user id from the user table
    getUserId: async (userId) => {
        // Try to get the user id from the user table
        try {
            const [rows, fields] = await pool.query(
                // Select the id from the user table where the id is equal to the user id
                `select id from user where id = ?`, [userId]
            )
            // Return the id
            return rows[0].id;
        } catch (error) {
            throw error
        }
    },
    // Insert a task into the checklist table
    sendTask: async (data) => {
        // Try to insert the task into the checklist table
        try {
            return await pool.query(
                // Insert the task name, task description, task deadline, task completed and user id into the checklist table
                `INSERT INTO checklist (taskName, taskDescription, taskDeadline, taskCompleted, user_id) VALUES (?,?,?,?,?)`, [
                    // The values to be inserted into the checklist table
                    data.taskName,
                    data.taskDescription || null,
                    data.taskDeadline,
                    data.taskCompleted,
                    data.user_id
                ]);
        } catch (error) {
            throw error;
        }
    },
    // Get all tasks from the checklist table
    getUsersTasks: async (userId) => {
        // Try to get all tasks from the checklist table
        try {
            // Select all tasks from the checklist table where the user id is equal to the user id
            const [rows, fields] = await pool.query(
                `select * from checklist where user_id = ?`, [userId]
            )
            return rows;
        } catch (error) {
            throw error
        }
    },
    // Update a task
    updateTask: async (id, data) => {
        // Try to update the task
        try {
            // Update the task completed column in the checklist table where the id is equal to the task id
            return await pool.query(`UPDATE checklist SET taskCompleted = ? WHERE id = ?`, [
                // The values to be updated in the checklist table
                data.taskCompleted,
                id
            ]);
        } catch (error) {
            throw error;
        }
    },
    // Delete a task
    deleteTask: async (id) => {
        // Try to delete the task
        try {
            // Delete the task from the checklist table where the id is equal to the task id
            return await pool.query(`DELETE FROM checklist WHERE id = ?`, [id]);
        } catch (error) {
            throw error;
        }
    },
    // Edit a task
    editTask: async (id, data) => {
        // Try to edit the task
        try {
            // Update the task name, task description and task deadline columns in the checklist table where the id is equal to the task id
            return await pool.query(`UPDATE checklist SET taskName = ?, taskDescription = ?, taskDeadline = ? WHERE id = ?`, [
                data.taskName,
                data.taskDescription,
                data.taskDeadline,
                id
            ]);
        } catch (error) {
            throw error;
        }
    }
};


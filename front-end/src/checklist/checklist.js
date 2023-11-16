import './checklistStyle.css'
import {useEffect, useState} from "react";
import axios from "axios";
import authHeader from "../authentication/auth.header";
import swal from "sweetalert";
import {CheckOutlined, EditOutlined, CloseOutlined, UndoOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

// This is the checklist page
export default function Checklist() {
    // These are the states that are used to store the data from the database
    const [taskName, setTaskName] = useState('')
    const [taskDeadline, setTaskDeadline] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [task, setTask] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editTaskId, setEditTaskId] = useState(null)
    const navigate = useNavigate();

    // This is the function that is used to add a task to the database
    const addTask = () => {
        if (!taskName) {
            // Show error message using sweet alert
            swal("Error", "Task name cannot be empty", "error");
            return; // Stop further execution of function
        }
        else if (!taskDeadline) {
            // Show error message using sweet alert
            swal("Error", "Task deadline cannot be empty", "error");
            return; // Stop further execution of function
        }

        // This is the axios post request that is used to add a task to the database
        axios.post('http://localhost:3001/api/checklist/addTask', {
                // This is the data that is being sent to the database
                taskName: taskName,
                taskDescription: taskDescription,
                taskDeadline: taskDeadline,
                taskCompleted: false,
                user_id: 0
            },
            // This is the header that is being sent with the request
            {headers: authHeader()}).then(() => {
            // This is the sweet alert that is used to show the user that the task has been added
            swal("Task added", "You can now see your task in the checklist", "success", {button: false})
            // This is the timeout that is used to reload the page after 2 seconds
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }).catch(function (error) {
            console.log(error);
        });
    }

    // This is the function that is used to get the tasks from the database
    // Check if user is logged in if not navigate to /login
    useEffect(() => {
        const getData = async () => {
            // This is the axios get request that is used to get the tasks from the database
            try {
                const {data} = await axios.get('http://localhost:3001/api/checklist/getTask', {headers: authHeader()})
                // This is the state that is used to store the data from the database
                setTask(data.data)
            } catch (error) {
                console.error(error)
                if (error.response.status === 403) {
                    navigate('/login')
                }
            }
        }
        getData()
    }, [])

    // This is the function that is used to complete a task in the database and it is called when the complete button is clicked
    const completeTask = (id) => {
        // This is the axios put request that is used to complete a task in the database
        axios.put(`http://localhost:3001/api/checklist/updateTask/${id}`, {
            // Marks the task as completed
            taskCompleted: true,
        }, {headers: authHeader()}).then(() => {
            // This is the sweet alert that is used to show the user that the task has been marked as completed
            swal("Task added", "Your Task Has Been Marked As Completed", "success", {button: false})
            // This is the timeout that is used to reload the page after 1.5 seconds
            setTimeout(function () {
                window.location.reload();
            }, 1500);
        }).catch(function (error) {
            console.log(error);
        });
    }

    // This is a function that will mark the task as not completed
    const taskNotCompleted = (id) => {
        // This is the axios put request that is used to mark the task as not completed
        axios.put(`http://localhost:3001/api/checklist/updateTask/${id}`, {
            taskCompleted: false,
        }, {headers: authHeader()}).then(() => {
            // This is the sweet alert that is used to show the user that the task has been marked as not completed
            // It also asks the user if they want to undo the task
            // If the user presses ok then the task will be marked as not completed
            // If the user presses cancel then the task will not change
            return new Promise((resolve, reject) => {
                swal({
                    title: "Are you sure?",
                    text: "Once Pressed Ok, You Will Have To Complete This Task Again!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    // If the user presses ok then the task will be marked as not completed
                    if (willDelete) {
                        resolve();
                        swal("OH NO! You Have To Do The Task Again", {
                            icon: "success",
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    }
                    // If the user presses cancel then the task will not change
                    else {
                        axios.put(`http://localhost:3001/api/checklist/updateTask/${id}`, {
                            taskCompleted: true,
                        }, {headers: authHeader()})
                            .then(() => {
                                resolve();
                                swal("Your task is still completed!");
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            });
                    }
                });
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    // This is the function that is used to delete a task from the database
    const deleteTask = (id) => {
        // This is the axios delete request that is used to delete a task from the database
        axios.delete(`http://localhost:3001/api/checklist/deleteTask/${id}`, {headers: authHeader()}).then(() => {
            // This is the sweet alert that is used to show the user that the task has been deleted
            // It also asks the user if they want to delete the task
            // If the user presses ok then the task will be deleted
            // If the user presses cancel then the task will not be deleted
            return new Promise((resolve, reject) => {
                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this task!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        swal("Poof! Your task has been deleted!", {
                            icon: "success",
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 1500);
                    } else {
                        axios.put(`http://localhost:3001/api/checklist/updateTask/${id}`, {
                            taskCompleted: true,
                        }, {headers: authHeader()})
                            .then(() => {
                                resolve();
                                swal("Your task is safe!");
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            });
                    }
                });
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    // This is a function which sets the state of the task as editing
    const handleEditClick = (id) => {
        setIsEditing(true)
        setEditTaskId(id)
    }

    // This is a function which handles the submit of the edit task
    const handleEditSubmit = (id) => {
        // This is the axios put request that is used to edit a task in the database
        axios.put(`http://localhost:3001/api/checklist/editTask/${id}`, {
            // These are the values the user can edit
            taskName: taskName,
            taskDescription: taskDescription,
            taskDeadline: taskDeadline,
        }, {headers: authHeader()}).then(() => {
            // This is the sweet alert that is used to show the user that the task has been edited
            swal("Task edited", "You can now see your edited task in the checklist", "success", {button: false})
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }).catch(function (error) {
            console.log(error);
        });
        // This is the state that is used to set the task as not editing
        setIsEditing(false)
        setEditTaskId(null)
    }

    // This is a function which handles the cancel of the edit task
    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditTaskId(null)
    }

    // This is the function that is used to render the checklist
    return (
        <div className="checklist-header">
            <h1 className="checklist-title">Checklist</h1>
            <div className="checklist-container">
                {isEditing && (
                    <div className="edit-task-container">
                        <div className="input-container">
                            <div className="input-field-group">
                                <h3 className="lbl">Edit Task</h3>
                                <input type="text" placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)}
                                       className="task-input" required/>
                                <input type="text" placeholder="Task Description"
                                       onChange={(e) => setTaskDescription(e.target.value)} className="task-input"
                                       required/>
                            </div>
                            <div className="input-field-group-2">
                                <input type="date" onChange={(e) => setTaskDeadline(e.target.value)}
                                       className="task-input"
                                       required/>
                            </div>
                        </div>
                        <div className="button">
                            <button onClick={() => handleEditSubmit(editTaskId)} className="add-task-btn">Submit Edit
                            </button>
                            <button onClick={handleCancelEdit} className="add-task-btn">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="checklist-body">
                {!isEditing && (
                    <div className="input-container">
                        <div className="edit-task-container">
                            <div className="input-field-group">
                                <input type="text" placeholder="Task Name" onChange={(e) => setTaskName(e.target.value)}
                                       className="task-input" required/>
                                <input type="text" placeholder="Task Description"
                                       onChange={(e) => setTaskDescription(e.target.value)} className="task-input"
                                       required/>
                            </div>
                            <div className="input-field-group-2">
                                <input type="date" onChange={(e) => setTaskDeadline(e.target.value)}
                                       className="task-input"
                                       required/>
                            </div>
                        </div>
                        <div className="button">
                            <button onClick={addTask} className="add-task-btn">Add Task</button>
                        </div>
                    </div>
                )}
                <div className="tasks-container">
                    <div className="task-list-container">
                        <h3 className="task-list-title">To Do</h3>
                        {task ? task.filter(t => t.taskCompleted === 0 && new Date(t.taskDeadline) > new Date()).map(t => (
                            <div key={t.taskName} className="task-item">
                                <div className="to-do-btn">
                                    <button onClick={() => completeTask(t.id)} className="update-btn1"><CheckOutlined/>
                                    </button>
                                    <button onClick={() => handleEditClick(t.id)} className="update-btn1">
                                        <EditOutlined/></button>
                                </div>
                                <div className="to-do-task">
                                    <p className="task-name">Title: {t.taskName}</p>
                                    <p className="task-desc">Description: {t.taskDescription}</p>
                                    <p className="task-deadline">Deadline: {new Date(t.taskDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : null}
                    </div>
                    <div className="task-list-done1">
                        <h3 className="task-list-title">Completed</h3>
                        {task ? task.filter(t => t.taskCompleted === 1).map(t => (
                            <div key={t.taskName} className="task-item">
                                <div className="to-do-btn">
                                    <button onClick={() => taskNotCompleted(t.id)} className="update-btn1">
                                        <UndoOutlined/></button>
                                    <button onClick={() => handleEditClick(t.id)} className="update-btn1">
                                        <EditOutlined/></button>
                                    <button onClick={() => deleteTask(t.id)} className="update-btn1"><CloseOutlined/>
                                    </button>
                                </div>
                                <div className="to-do-task">
                                    <p className="task-name">Title: {t.taskName}</p>
                                    <p className="task-desc">Description: {t.taskDescription}</p>
                                    <p className="task-deadline">Deadline: {new Date(t.taskDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : null}
                    </div>
                    <div className="overdue">
                        <h3 className="task-list-title">Overdue</h3>
                        {task ? task.filter(t => new Date(t.taskDeadline) < new Date() && t.taskCompleted === 0).map(t => (
                            <div key={t.taskName} className="task-item">
                                <div className="to-do-btn">
                                    <button onClick={() => deleteTask(t.id)} className="update-btn1"><CloseOutlined/>
                                    </button>
                                    <button onClick={() => handleEditClick(t.id)} className="update-btn1">
                                        <EditOutlined/></button>
                                </div>
                                <div className="to-do-task">
                                    <p className="task-name">Title: {t.taskName}</p>
                                    <p className="task-desc">Description: {t.taskDescription}</p>
                                    <p className="task-deadline">Deadline: {new Date(t.taskDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

import axios from "axios";

// login is a function that takes in username and password as parameters and returns a promise
// This function will be used to login a user and set the token in local storage
// So that other components can use the token to make requests to the server just for that user
const login = async (username, password) => {
    try {
        // Make a post request to the server to login the user and get the token back
        const response = await axios.post('http://localhost:3001/api/users/login', {username, password});
        // If the token is returned then set the token in local storage
        if (response.data.token) {
            // Set the token in local storage
            localStorage.setItem("token", JSON.stringify(response.data));
        }
        // Return the response data
        return response.data;
    } catch (error) {
        // If there is an error then log it to the console and throw the error
        console.error(error);
        throw error;
    }
};

// A function that removes the token from local storage which will log the user out
const logout = () => {
    localStorage.removeItem("token");
};

// A function that gets the current user from local storage and returns it as a JSON object so that other components can use it if they need to verify the user
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("token"));
}
// Add a similar const in order to get users token which will enable you to use their details based off the token
// E.g., const getPost = () => {
// localStorage.removeItem("token")
// }
// And then add getPost to authService
// To get users details based of token when you want to get the request make sure u do i.e., AuthService.getPost
// If u need more help @ me in the server to explain properly

// Export the login, logout, and getCurrentUser functions so that other components can use them
const authService = {
    login, logout, getCurrentUser
}
export default authService;
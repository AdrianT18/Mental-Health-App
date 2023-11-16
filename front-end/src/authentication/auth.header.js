// This file is used to add the token to the header of the request
export default function authHeader() {
    // Get the token from local storage
    const user = JSON.parse(localStorage.getItem("token"));
    // If the token exists, add it to the header of the request
    if (user && user.token) {
        // returns an object with the key Authorization and the value Bearer + the token
        return { Authorization: 'Bearer ' + user.token };
    } else {
        // If the token doesn't exist, return an empty object
        return {};
    }
}
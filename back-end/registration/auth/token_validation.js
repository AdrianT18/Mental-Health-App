const jwt = require("jsonwebtoken");

module.exports = {
    // Check if the token is valid
    // If the token is valid, the user is logged in
    // If the token is invalid, the user is not logged in
    checkToken: (req, res, next) => {
        // Get the token from the header
        let token = req.get("authorization");
        // Check if the token is valid and if it is, verify it by using the key from the .env file
        if (token) {
            // Remove the Bearer from the token
            token = token.slice(7);
            // Verify the token by using jwt.verify
            jwt.verify(token, process.env.KEY, (err, decoded) => {
                // If the token is invalid, return an error
                if (err) {
                    return res.status(403).json({
                        auth:false,
                        message: "Invalid Token"
                    });
                } else {
                    // If the token is valid, add the user to the request and store the token in local storage
                    res.locals = {
                        ...res.locals,
                        user: decoded.result
                    }
                    next();
                }
            });
        } else {
            // If the token is not present, return an error by using the status code 403
            return res.status(403).json({
                success: 0,
                message: "Access Denied! Unauthorized User"
            });
        }
    }
};

const jwt = require("jsonwebtoken")
const {ErrorHandler} = require("../middlewares/errorHandling");

const auth = (req, res, next) => {
    const token = req.header('auth-token')
    try {
        if (!token){
            return next(new ErrorHandler(400, "No authentication token, access denied."));
        }
        const verified = jwt.verify(token, process.env.USER_KEY)
        if (!verified){
            return next(new ErrorHandler(400, "Token verification failed, access denied."));
        }
        req.user = verified.id
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth;
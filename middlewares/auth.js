const jwt = require("jsonwebtoken")
const {User} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");

const auth = async (req, res, next) => {
    const token = req.header('auth-token')
    try {
        if (!token){
            return next(new ErrorHandler(400, "No authentication token, access denied."));
        }
        const verified = jwt.verify(token, process.env.USER_KEY)
        if (!verified){
            return next(new ErrorHandler(400, "Token verification failed, access denied."));
        }
        const user = await User.findOne({ _id: verified.id });
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth;
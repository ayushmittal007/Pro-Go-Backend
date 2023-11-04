const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.header('auth-token')
    try {
        if (!token){
            return res.status(401).json({ msg: 'No authentication token, access denied.' })
        }
        const verified = jwt.verify(token, process.env.USER_KEY)
        if (!verified){
            return res.status(401).json({ msg: 'Token verification failed, access denied.' })
        }
        req.user = verified.id
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth;
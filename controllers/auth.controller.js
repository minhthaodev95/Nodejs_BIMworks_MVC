const Author = require('../models/author.model')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')

module.exports.authMiddleware = async (req, res, next) => {
    
    try {
        let token = req.cookies.token;
        let hasToken = jwt.verify(token, process.env.SECRET_KEY)
        if (hasToken) {
            let accountAdmin = await Author.findById(hasToken._id).then(user => user);
            req.userAdmin = accountAdmin;
            next();
        }
    } catch (error) {
        res.redirect('/')
    }
}
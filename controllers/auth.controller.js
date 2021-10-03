const Author = require('../models/author.model')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')

module.exports.authMiddleware = (req, res, next) => {
    
    try {
        let token = req.cookies.token;
        let hasToken = jwt.verify(token, 'secretString')
        if(hasToken) {
            next();
        }
    } catch (error) {
        res.redirect('/')
    }
}
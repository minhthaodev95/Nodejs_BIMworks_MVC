let mongoose = require('mongoose');
let validator = require('validator')

let authorSchema = mongoose.Schema({
    name :{
        type : String,
        required : [true, "Please tell us your name !!"]
    },
    age : {
        type : Number
    },
    gender : {
        type :  String,
        enum : ['male', 'female'],
        
    },
    email : {
        type   : String,
        required : [true, "Please provide me your email!"],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email !']
    },
    username : {
        type :String,
        required : [true , 'User must have a username']
    },
    password : {
        type : String,
        required : [true, 'User must have a password !' ],
    },
    photo : {
        type : String,
        default: '/upload/default_avatar.jpg'
    },
    address : {
        type : String
    },
    role : {
        type : String ,
        enum : ['admin', 'editor', 'author', 'guest'],
        default : 'guest'
    },

});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;

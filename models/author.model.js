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
    email : {
        type   : String,
        required : [true, "Please provide me your email!"],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email !']
    },
    password : {
        type : String,
        required : [true, 'User must have a password !' ],
    },
    photo : {
        type : String
    },
    role : {
        type : String ,
        enum : ['admin', 'editor', 'author', 'guest'],
        default : 'guest'
    },
  
});
   

const Author = mongoose.model('Author', authorSchema);

// Author.create({
//     name : 'Minh Thao',
//     age : 25,
//     email : 'minhthao.dev95@gmail.com',
//     password : 'password',
//     photo : 'linktophoto',
//     role : 'admin',

// })



module.exports = Author;



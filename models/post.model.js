let mongoose = require('mongoose')
const moment = require('moment-timezone');
const dateVN = moment.tz(Date.now(),'Asia/Bangkok');

let postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, 'The post must have title']
    },
    expert : {
        type : String
    },
    tags : {
        type : []
    },
    featureImage : {
        type : String
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    parentCategory : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentCategory'
    },
    type: {
        type :String,
        enum : ['Project' , 'Article']
    },
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Author'
    },
    url : {
        type :String
    },
    body : {
        type : String
    },
    createAt : {
        type: Date,
        default :  dateVN
    }
})


const Post = mongoose.model('Post', postSchema);


// Post.find()
//         .populate('authorID')
//         .populate('category')
//         .then(data => {
//             console.log(data);
//         })
//         .catch(err => console.log(err));


    // Post.create({
    //     title : 'Bai viet Article so 9999' ,
    //     expert : "Expert cua bai viet so 9999" ,
    //     tag : "Bai viet so" ,
    //     featureImage : '/upload/default_avatar.jpg',
    //     category : null,
    //     parentCategory : null,
    //     type : "Article",
    //     authorID : "6152d90fb037d9754af94057",
    //     url : "bai-viet-so-9999",
    //     body : "<p> Body  cua cac bai viet </p>"
    // })    


module.exports = Post;
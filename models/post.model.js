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
    authorID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Author'
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
// console.log(dateVN);
// let post2 = new Post({
//     title:'Tieu de 522',
//     expert : 'This is expert oft he post',
//     tags : ['thiet ke', 'du an'],
//     image : ['lintoimage1', 'linktoimage2'],
//     featureInmage: 'linktoImage3',
//     category : null,
//     authorID : '61514d05f3dc0487a87dafe6',
//     body : 'This is body of the post'
// })
// post2.save();

// Post.find()
//         .populate('authorID')
//         .populate('category')
//         .then(data => {
//             console.log(data);
//         })
//         .catch(err => console.log(err));



module.exports = Post;
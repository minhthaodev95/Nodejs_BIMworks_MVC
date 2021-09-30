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
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Category'
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



module.exports = Post;
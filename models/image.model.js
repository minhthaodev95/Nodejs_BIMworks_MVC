let mongoose = require('mongoose')

let imageSchema = mongoose.Schema({
    urlUpload : {
        type :String,
        required : [true, 'Image must have url']
    }
})

const Image = mongoose.model('image', imageSchema)

module.exports = Image;
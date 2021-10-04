let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    name : {
        type :String,
        required : [true, 'Category must have name']
    },
    slugName: {
        type: String,
        required :[true, 'Category must have slug']
    }
})

const Category = mongoose.model('Category', categorySchema)
// Category.create({
//     name : 'Biet thu'
// })
module.exports = Category;
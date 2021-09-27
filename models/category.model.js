let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    name : {
        type :String,
        required : [true, 'Category must have name']
    }
})

const Category = mongoose.model('Category', categorySchema)
// Category.create({
//     name : 'Biet thu'
// })
module.exports = Category;
let mongoose = require('mongoose')

let parentCategorySchema = mongoose.Schema({
    name : {
        type :String,
        required : [true, 'Category must have name']
    }
})

const ParentCategory = mongoose.model('ParentCategory', parentCategorySchema)
// Category.create({
//     name : 'Biet thu'
// })
module.exports = ParentCategory;
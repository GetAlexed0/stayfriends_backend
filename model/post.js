const mongoose = require('mongoose')
const img = require('./img')
const user = require('./user')

const dataSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true

    },
    postedBy: String,
    likedBy: [String],
    date: {
        required: true,
        type: Date
    },
    validatedMail: {
        required: true,
        type: Boolean
    },
    img: img
}, {collection: "posts"})

module.exports = mongoose.model('Data', dataSchema)
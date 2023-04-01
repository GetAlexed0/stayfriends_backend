const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true

    },
    prename: {
        required: true,
        type: String
    },
    surname: {
        required: true,
        type: String
    },
    birthday: {
        required: true,
        type: Date
    },
    validatedMail: {
        required: true,
        type: Boolean
    },
    password: {
        required:true,
        type: String
    }
}, {collection: "users"})

module.exports = mongoose.model('Data', dataSchema)
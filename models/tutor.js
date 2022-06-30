const mongoose = require('mongoose')
const validator = require('validator')

const TutorSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide your first name'],
        maxlength: 50,
        minlength: 3,
    },
    lastname: {
        type: String,
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        //required: [true, 'Please provide your email'],
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
        ],
        unique: true,
        //validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please provide a valid phone number'],
        maxlength: 20
    },
    major: {
        type: String,
        minlength: 3
    },
    university: {
        type: String,
        minlength: 5
    },
    medium: {
        type: String,
        minlength: 5
    },
    subjects: [{
        type: String,
        //required: [true, 'Please list the subjects you are willing to teach']
    }],
    locations: [{
        type: String,
        //required: [true, 'Please list the locations where you are willing to teach']
    }]
})

module.exports = mongoose.model('TutorDetails', TutorSchema)
// Student/Parent Details
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const StudentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide your first name"],
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
    // match: [
    // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // 'Please provide a valid email',
    // ],
    //unique: true,
    //validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, "Please provide a valid phone number"],
    maxlength: 20,
    unique: true,
  },
  photoUrl: {
    type: String,
  },
  // major: {
  //     type: String,
  //     minlength: 3
  // },
  posts: [
    {
      school: {
        type: String,
        minlength: 5,
      },
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      date: {
        type: String,
      },
      medium: {
        type: String,
        minlength: 5,
      },
      class: {
        type: String,
      },
      online: {
        type: String,
      },
      subjects: [
        {
          type: String,
          //required: [true, 'Please list the subjects you are willing to teach']
        },
      ],
      location: {
        type: String,
        //required: [true, 'Please list the locations where you are willing to teach']
      },
      applied: [
        {
            type: Schema.Types.ObjectId,
            ref: "TutorDetails",
        }
      ],
      liked: [
        {
          type: Schema.Types.ObjectId,
          ref: "TutorDetails",
        },
      ],
      rejected: [
        {
          type: Schema.Types.ObjectId,
          ref: "TutorDetails",
        },
      ],
      max_salary: {
        type: String,
      },
      min_salary: {
        type: String,
      },
      tutor_gender: {
        type: String,
      },
      student_gender: {
        type: String,
      },
      availability_days: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("StudentDetails", StudentSchema);

const StudentDetails = require('../models/student')
const TutorDetails = require('../models/tutor')

const userInfo = async(req, res) => {
    let {first_name, last_name, number, role} = await req.body
    if (role == 'student') {
        await StudentDetails.create({firstname: first_name, lastname: last_name, phone: number})
    } else if (role == 'tutor') {
        await TutorDetails.create({firstname: first_name, lastname: last_name, phone: number})
    }
}

const postingInfo = async(req, res) => {
    const body = req.body
    const number = body.phone_number
    await StudentDetails.updateOne({phone: number}, {$push:
        {   posts: {
                email: body.email,
                medium: body.medium,
                subjects: body.subject,
                location: body.location,
                class: body.class,
                presence: body.online,
                max_salary: body.max_salary,
                min_salary: body.min_salary,
                tutor_gender: body.preferred_gender, 
                student_gender: body.student_gender,
                availability_days: body.days,
                preferred_institution: body.school
            }
        },
    })
}

module.exports = {userInfo, postingInfo}
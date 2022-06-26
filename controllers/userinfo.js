const StudentDetails = require('../models/student')
const TutorDetails = require('../models/tutor')

const userInfo = async(req, res) => {
    console.log(req.body)
    let {first_name, last_name, number, role} = await req.body
    if (role == 'student') {
        await StudentDetails.create({firstname: first_name, lastname: last_name, phone: number})
    }
}

module.exports = {userInfo}
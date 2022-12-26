const StudentDetails = require("../models/student");
const TutorDetails = require("../models/tutor");

const uploadPhoto = async(req, res) => {
    const data = req.body
    if (data.role == 'tutor') {
        await TutorDetails.findOneAndUpdate(
            {phone: data.phone},
            {photoUrl: data.link}
        )
    } else {
        await StudentDetails.findOneAndUpdate(
            {phone: data.phone},
            {photoUrl: data.link}
        )
    }
}

module.exports = {uploadPhoto}

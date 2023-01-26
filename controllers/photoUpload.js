const StudentDetails = require("../models/student");
const TutorDetails = require("../models/tutor");

const uploadPhoto = async(req, res) => {
    const data = req.body
    let old_photo = ''
    if (data.role == 'tutor') {
        old_photo = await TutorDetails.findOneAndUpdate(
            {phone: data.phone},
            {photoUrl: data.link}
        )
    } else {
        old_photo = await StudentDetails.findOneAndUpdate(
            {phone: data.phone},
            {photoUrl: data.link}
        )
    }
    res.json({
        link: old_photo.photoUrl
    })
}

module.exports = {uploadPhoto}

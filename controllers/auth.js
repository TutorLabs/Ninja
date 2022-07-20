const admin = require("firebase-admin")
const StudentDetails = require('../models/student')
const TutorDetails = require('../models/tutor')


const verifyUser = async(req, res) => {
    const idToken = req.body
    const token = idToken.stsTokenManager.accessToken

    await admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
        const uid = decodedToken.uid
        res.json({
            status: 'success',
            decodedToken
        })
    }).catch((error) => {
        console.log(error)
    })
}

const userExists = async(req, res) => {
    const data = req.body
    const student = await StudentDetails.find({ phone: data.number })
    const tutor = await TutorDetails.find({ phone: data.number })
    let role = ''
    if (Object.keys(student).length > 0) {
        role = 'student'
    } else if (Object.keys(tutor).length > 0) {
        role = 'tutor'
    }

    if (role != '') {
        res.json({
            exists: true,
            role: role
        })
    } else {
        res.json({
            exists: false,
            role: role
        })
    }
}

module.exports = {
    verifyUser,
    userExists
}
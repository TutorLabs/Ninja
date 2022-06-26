const admin = require("firebase-admin")


const verifyUser = async(req, res) => {
    const idToken = req.body.verificationId
    console.log(idToken)

    await admin.auth().verifyIdToken(idToken)
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

module.exports = {
    verifyUser
}
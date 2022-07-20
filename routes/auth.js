const express = require('express')
const router = express.Router()

const {verifyUser, userExists} = require('../controllers/auth')

router.post('/authenticate', verifyUser)
router.post('/exists', userExists)

module.exports = router
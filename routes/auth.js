const express = require('express')
const router = express.Router()

const {verifyUser} = require('../controllers/auth')

router.post('/authenticate', verifyUser)

module.exports = router
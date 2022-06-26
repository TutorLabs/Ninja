const express = require('express')
const router = express.Router()

const{userInfo} = require('../controllers/userinfo')

router.post('/info', userInfo)

module.exports = router
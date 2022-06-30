const express = require('express')
const router = express.Router()

const{userInfo, postingInfo} = require('../controllers/userinfo')

router.post('/info', userInfo)
router.post('/posting', postingInfo)

module.exports = router
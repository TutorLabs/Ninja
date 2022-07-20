const express = require('express')
const router = express.Router()

const{userInfo, postingInfo, getPostInfo, tutorlist, applied} = require('../controllers/userinfo')

router.post('/info', userInfo)
router.route('/posting').post(postingInfo).get(getPostInfo)
router.get('/tutors', tutorlist)
router.post('/apply', applied)
// router.post('/posting', postingInfo)

module.exports = router
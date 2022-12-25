const express = require('express')
const router = express.Router()
const {uploadPhoto} = require('../controllers/photoUpload')


router.route('/photo').post(uploadPhoto)

module.exports = router

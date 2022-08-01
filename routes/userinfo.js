const express = require("express");
const router = express.Router();

const {
  userInfo,
  postingInfo,
  getPostInfo,
  tutorlist,
  applied,
  getUserPosts,
  deleteUserPost
} = require("../controllers/userinfo");

router.post("/info", userInfo);
router.route("/posting").post(postingInfo).get(getPostInfo);
router.get("/tutors", tutorlist);
router.post("/apply", applied);
router.get("/myposts", getUserPosts);
router.delete("/post/:id", deleteUserPost)
// router.post('/posting', postingInfo)

module.exports = router;

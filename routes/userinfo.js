const express = require("express");
const router = express.Router();

const {
  userInfo,
  postingInfo,
  getPostInfo,
  tutorlist,
  applied,
  getUserPosts,
  deleteUserPost,
  getSinglePost,
  updatePost
} = require("../controllers/userinfo");

router.post("/info", userInfo);
router.route("/posting").post(postingInfo).get(getPostInfo);
router.get("/tutors", tutorlist);
router.post("/apply", applied);
router.get("/myposts", getUserPosts);
router.route("/post/:id").delete(deleteUserPost).get(getSinglePost).put(updatePost)

module.exports = router;

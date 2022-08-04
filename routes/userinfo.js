const express = require("express");
const router = express.Router();

const {
  createUser,
  createStudentPost,
  getPostInfo,
  tutorlist,
  applied,
  getUserPosts,
  deleteUserPost,
  getSinglePost,
  updatePost,
  getPostApplicants,
  getPhoneNumber,
  createTutorProfile,
  getProfileInitial
} = require("../controllers/userinfo");

router.post("/register", createUser);
router.route("/posting").post(createStudentPost).get(getPostInfo);
router.get("/tutors", tutorlist);
router.post("/apply", applied);
router.get("/myposts", getUserPosts);
router.route("/post/:id").delete(deleteUserPost).get(getSinglePost).put(updatePost)
router.get("/applicants/:id", getPostApplicants)
router.get("/phone", getPhoneNumber)
router.route("/profile").post(createTutorProfile)
router.get("/profileinfo", getProfileInitial)

module.exports = router;

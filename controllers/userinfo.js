const StudentDetails = require("../models/student");
const TutorDetails = require("../models/tutor");
const admin = require("firebase-admin");

const userInfo = async (req, res) => {
  let { first_name, last_name, number, role } = await req.body;
  if (role == "student") {
    await StudentDetails.create({
      firstname: first_name,
      lastname: last_name,
      phone: number,
    });
  } else if (role == "tutor") {
    await TutorDetails.create({
      firstname: first_name,
      lastname: last_name,
      phone: number,
    });
  }
  res.json({
    success: "Success",
  });
};

const postingInfo = async (req, res) => {
  const body = req.body;
  const number = body.phone_number;
  await StudentDetails.updateOne(
    { phone: number },
    {
      $push: {
        posts: {
          email: body.email,
          medium: body.medium,
          subjects: body.subject,
          location: body.location,
          class: body.class,
          presence: body.online,
          max_salary: body.max_salary,
          min_salary: body.min_salary,
          tutor_gender: body.preferred_gender,
          student_gender: body.student_gender,
          availability_days: body.days,
          preferred_institution: body.school,
        },
      },
    }
  );
  res.json({
    success: "Success",
  });
};

const getPostInfo = async (req, res) => {
  const data = await StudentDetails.find({}, { posts: 1, _id: 0 });
  res.json({
    data,
  });
};

const tutorlist = async (req, res) => {
  const data = await TutorDetails.find({});
  res.json({
    data,
  });
};

const applied = async (req, res) => {
  const token = req.body.token;
  const phone = await verify(token);
  const user = await TutorDetails.find({ phone: phone });
  const id = user[0]._id;
};

const getUserPosts = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const user = await StudentDetails.find({ phone: phone });
  if (Object.keys(user).length > 0) {
    const data = user[0].posts;
    console.log(user[0].posts);
    res.json({
      data,
    });
  }
};

async function verify(token) {
  let phone = "";
  await admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      phone = decodedToken.phone_number;
    })
    .catch((error) => {
      console.log(error);
    });
  return phone;
}

module.exports = {
  userInfo,
  postingInfo,
  getPostInfo,
  tutorlist,
  applied,
  getUserPosts,
};

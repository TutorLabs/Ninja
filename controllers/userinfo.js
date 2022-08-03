const StudentDetails = require("../models/student");
const TutorDetails = require("../models/tutor");
const admin = require("firebase-admin");
const { ObjectId } = require("mongodb");
const tutor = require("../models/tutor");

// Creates the user with the initial info
const createUser = async (req, res) => {
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

// Creates a new post for the user
const createStudentPost = async (req, res) => {
  const body = req.body;
  const number = body.phone_number;
  await StudentDetails.updateOne(
    { phone: number },
    {
      $push: {
        posts: {
          email: body.email,
          medium: body.medium,
          subjects: body.subjects,
          location: body.location,
          class: body.class,
          online: body.online,
          max_salary: body.max_salary,
          min_salary: body.min_salary,
          tutor_gender: body.preferred_gender,
          student_gender: body.student_gender,
          availability_days: body.days,
          school: body.school,
          date: new Date().toISOString().slice(0, 10),
          firstname: body.firstname,
          lastname: body.lastname,
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
  const postings = [];
  data.map((item) => {
    item.posts.map((post) => {
      postings.push(post);
    });
  });
  res.json({
    postings,
  });
};

const tutorlist = async (req, res) => {
  const data = await TutorDetails.find({});
  res.json({
    data,
  });
};

const applied = async (req, res) => {
  const body = req.body;
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const user = await TutorDetails.find({ phone: phone });
  console.log(user);
  const id = body.id;
  console.log(id);
  const data = await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(id) },
    {
      $push: {
        "posts.$.applied": ObjectId(user[0]._id),
      },
    }
  );
  console.log(data);
};

const getUserPosts = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const user = await StudentDetails.find({ phone: phone });
  if (Object.keys(user).length > 0) {
    const data = user[0].posts;
    res.json({
      data,
    });
  }
};

const deleteUserPost = async (req, res) => {
  const data = await StudentDetails.updateOne(
    { "posts._id": ObjectId(req.params.id) },
    {
      $pull: { posts: { _id: ObjectId(req.params.id) } },
    }
  );
  res.json({
    success: "success",
  });
};

const getSinglePost = async (req, res) => {
  const data = await StudentDetails.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": ObjectId(req.params.id) } },
  ]);
  const post = data[0].posts;
  res.json({
    post,
  });
};

const getPostApplicants = async(req, res) => {
  console.log(req.params.id)
  const data = await StudentDetails.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": ObjectId(req.params.id) } },
  ]);
  const post = data[0].posts.applied;
  let applicants = []
  await Promise.all(post.map(async(item) => {
    await TutorDetails.findOne({"_id": ObjectId(item)}).then(tutor => {
      applicants.push(tutor)
    })
  }))
  res.json({
    applicants
  })
}

const updatePost = async (req, res) => {
  const body = req.body;
  await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(req.params.id) },
    {
      $set: {
        "posts.$.firstname": body.firstname,
        "posts.$.lastname": body.lastname,
        "posts.$.email": body.email,
        "posts.$.medium": body.medium,
        "posts.$.subjects": body.subjects,
        "posts.$.online": body.online,
        "posts.$.location": body.location,
        "posts.$.class": body.class,
        "posts.$.max_salary": body.max_salary,
        "posts.$.min_salary": body.min_salary,
        "posts.$.tutor_gender": body.preferred_gender,
        "posts.$.student_gender": body.student_gender,
        "posts.$.availability_days": body.days,
        "posts.$.school": body.school,
      },
    }
  );
};

const getPhoneNumber = async(req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  res.json({
    phone: phone
  })
}
 
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
  getPhoneNumber
};

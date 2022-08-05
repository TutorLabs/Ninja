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

const createTutorProfile = async (req, res) => {
  const body = req.body;
  const number = body.phone;
  await TutorDetails.updateOne(
    { phone: number },
    {
      email: body.email,
      medium: body.medium,
      subjects: body.subjects,
      locations: body.locations,
      class: body.class,
      online: body.online,
      max_salary: body.max_salary,
      min_salary: body.min_salary,
      tutor_gender: body.tutor_gender,
      days: body.days,
      school: body.school,
      firstname: body.firstname,
      lastname: body.lastname,
      eca: body.eca,
      hobbies: body.hobbies,
      experience: body.experience,
      other: body.other,
      bio: body.bio,
      major: body.major,
      university: body.university,
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
  const id = body.id;
  const data = await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(id) },
    {
      $push: {
        "posts.$.applied": ObjectId(user[0]._id),
      },
    }
  );
};

const getUserPosts = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const user = await StudentDetails.find({ phone: phone });
  const data = user[0].posts;
  res.json({
    data,
  });
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
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const data = await StudentDetails.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": ObjectId(req.params.id) } },
  ]);
  let post = data[0].posts;
  post = { ...post, phone_number: phone };
  res.json({
    post,
  });
};

const getPostApplicants = async (req, res) => {
  const data = await StudentDetails.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": ObjectId(req.params.id) } },
  ]);
  const applied = data[0].posts.applied;
  const liked = data[0].posts.liked;
  const rejected = data[0].posts.rejected;
  let appliedApplicants = [];
  let likedApplicants = [];
  let rejectedApplicants = [];
  await Promise.all(
    applied.map(async (item) => {
      await TutorDetails.findOne({ _id: ObjectId(item) }).then((tutor) => {
        appliedApplicants.push(tutor);
      });
    })
  );
  await Promise.all(
    liked.map(async (item) => {
      await TutorDetails.findOne({ _id: ObjectId(item) }).then((tutor) => {
        likedApplicants.push(tutor);
      });
    })
  );
  await Promise.all(
    rejected.map(async (item) => {
      await TutorDetails.findOne({ _id: ObjectId(item) }).then((tutor) => {
        rejectedApplicants.push(tutor);
      });
    })
  );
  const allApplicants = {
    applied: appliedApplicants,
    liked: likedApplicants,
    rejected: rejectedApplicants,
  };
  res.json({
    allApplicants,
  });
};

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
  res.json({
    success: "Success",
  });
};

const getPhoneNumber = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  res.json({
    phone: phone,
  });
};

const getProfileInitial = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const tutor = await TutorDetails.find({ phone: phone });
  const tutorInfo = tutor[0]
  res.json({
    tutorInfo,
  });
};

const addLikedTutor = async (req, res) => {
  const post_id = req.params.id;
  const body = req.body;
  await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(post_id) },
    {
      $push: {
        "posts.$.liked": ObjectId(body.tutor_id),
      },
    }
  );
};

const addRejectedTutor = async (req, res) => {
  const post_id = req.params.id;
  const body = req.body;
  await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(post_id) },
    {
      $push: {
        "posts.$.rejected": ObjectId(body.tutor_id),
      },
    }
  );
};

const getTutorInfo = async(req, res) => {
  const data = await TutorDetails.findOne({_id: ObjectId(req.params.id)})
  res.json({
    data
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
  getPhoneNumber,
  createTutorProfile,
  getProfileInitial,
  addLikedTutor,
  addRejectedTutor,
  getTutorInfo
};

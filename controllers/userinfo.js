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
      photoUrl: "https://firebasestorage.googleapis.com/v0/b/tutorlab-cbc12.appspot.com/o/user_default.png?alt=media&token=e4af10f1-b432-4d3f-a78d-9b09d950b120"
    });
  } else if (role == "tutor") {
    await TutorDetails.create({
      firstname: first_name,
      lastname: last_name,
      phone: number,
      photoUrl: "https://firebasestorage.googleapis.com/v0/b/tutorlab-cbc12.appspot.com/o/user_default.png?alt=media&token=e4af10f1-b432-4d3f-a78d-9b09d950b120"
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
          tutor_gender: body.tutor_gender,
          student_gender: body.student_gender,
          availability_days: body.availability_days,
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
      result: body.result,
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
  const allInfo = await StudentDetails.find({});
  const postings = [];
  const appliedPostings = []
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  let tutorAppliedTo = await TutorDetails.find({phone: phone}, 'appliedto')
  tutorAppliedTo = tutorAppliedTo[0].appliedto
  allInfo.map((item) => {
    let photo = ''
    if (item.photoUrl) {
      photo = item.photoUrl
    }
    if (Array.isArray(item.posts) && item.posts.length) {
      item.posts.map((post) => {
        if (!tutorAppliedTo.includes(post._id)) {
          let updatedPost = JSON.parse(JSON.stringify(post))
          updatedPost = {...updatedPost, photoUrl: photo}
          postings.push(updatedPost)
        } else {
          let updatedPost = JSON.parse(JSON.stringify(post))
          updatedPost = {...updatedPost, photoUrl: photo}
          appliedPostings.push(updatedPost)
        }
      })
    }
  })
  postings.reverse()
  res.json({
    postings,
    appliedPostings
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
  const tutorApplied = await TutorDetails.updateOne(
    {phone: phone},
    {
      $push: {
        appliedto: ObjectId(id)
      }
    }
  )
  res.json({
    success: "Success"
  })
};

const getUserPosts = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const user = await StudentDetails.find({ phone: phone });
  if (Array.isArray(user) && user.length) {
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
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const phone = await verify(token);
  const userInfo = await StudentDetails.find({phone: phone})
  const photoUrl = userInfo[0].photoUrl
  const data = await StudentDetails.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": ObjectId(req.params.id) } },
  ]);
  let post = data[0].posts;
  post = { ...post, phone_number: phone, photoUrl: photoUrl  };
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
        "posts.$.availability_days": body.availability_days,
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
  const userInfo = await StudentDetails.find({phone: phone})
  const photoUrl = userInfo[0].photoUrl
  res.json({
    phone: phone,
    photoUrl: photoUrl
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
  await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(post_id) },
    {
      $pull: {
        "posts.$.applied": ObjectId(body.tutor_id),
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
  await StudentDetails.findOneAndUpdate(
    { "posts._id": ObjectId(post_id) },
    {
      $pull: {
        "posts.$.applied": ObjectId(body.tutor_id),
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

const sendConnectedSMS = async(req, res) => {
  const post_id = req.params.id;
  const body = req.body;
  const tutorInfo = await TutorDetails.findById(body.tutor_id, 'phone firstname lastname')
  const studentPosterInfo = await StudentDetails.find(
    { "posts._id": ObjectId(post_id) }
  )
  const studentPhoneNumber = studentPosterInfo[0].phone
  const postings = studentPosterInfo[0].posts
  let studentFirstName = ''
  let studentLastName = ''
  for (const i in postings) {
    if (postings[i]._id.valueOf() == post_id) {
      studentFirstName = postings[i].firstname
      studentLastName = postings[i].lastname
      break
    }
  }
  const tutorFullName = `${tutorInfo.firstname} ${tutorInfo.lastname}`
  const studentFullName = `${studentFirstName} ${studentLastName}`
  const tutorPhoneNumber = tutorInfo.phone

  res.json({
    tutorFullName: tutorFullName,
    studentFullName: studentFullName,
    tutorPhoneNumber: tutorPhoneNumber,
    studentPhoneNumber: studentPhoneNumber
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
  getTutorInfo,
  sendConnectedSMS
};

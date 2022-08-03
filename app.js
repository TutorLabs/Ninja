const express = require('express')
const app = express()
var cors = require("cors")
const { default: mongoose } = require('mongoose')
const bodyParser = require("body-parser")
const csrf = require("csurf")
const cookieParser = require("cookie-parser")
const admin = require("firebase-admin")

const csrfMiddleware = csrf({cookie: true})
const serviceAccount = require("./serviceAccountKey.json")

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(csrfMiddleware)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken())
    next()
})
// Connect to env file
const dotenv = require("dotenv")
dotenv.config()

// DB connection
const connectDB = require('./db/connect')

// Routers
var testApiRouter = require("./routes/testApi");
const verify = require("./routes/auth")
const details = require("./routes/userinfo")

// Routes
app.use("/testapi", testApiRouter);
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.use('/api', verify)
app.use('/api', details)

const port = process.env.PORT || 9000

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      )
    } catch (error) {
      console.log(error);
    }
  }
  
start();
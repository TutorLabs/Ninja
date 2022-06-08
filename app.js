const express = require('express')
const app = express()
var cors = require("cors")
const { default: mongoose } = require('mongoose')

app.use(cors())

// Connect to env file
const dotenv = require("dotenv")
dotenv.config()

// DB connection
const connectDB = require('./db/connect')

// Routers
var testApiRouter = require("./routes/testApi");

// Routes
app.use("/testapi", testApiRouter);
app.get('/', (req, res) => {
    res.send('Hello World')
})

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
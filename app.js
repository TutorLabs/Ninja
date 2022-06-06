const express = require('express')
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT || 9000

const connectDB = require('./db/connect')

var testApiRouter = require("./routes/testApi");
var cors = require("cors")
const { default: mongoose } = require('mongoose')

app.use("/testapi", testApiRouter);
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})

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
const express = require('express')
const app = express()
const port = process.env.PORT || 9000

var testApiRouter = require("./routes/testApi");
var cors = require("cors")

app.use("/testapi", testApiRouter);
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Example app listening at PORT=${port}`)
})
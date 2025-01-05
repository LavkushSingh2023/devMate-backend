const express = require("express")

const app = express()

app.get("/hello", (req, res) => {
    console.log(req.query)              // http://localhost:3000/hello?userId=123
    res.send("llo page is here!")
})

app.get("/test/:userId/:name", (req, res) => {
    console.log(req.params)                          // http://localhost:3000/test/120/Lavkush
    res.send("this is test page!")
})

app.use("/", (req, res) => {
    res.send("o page is here!")
})

app.listen(3000, () => {
    console.log("Server listening at 3000")
})
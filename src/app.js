const express = require("express")

const app = express()

app.use("/hello", (req, res) => {
    res.send("llo page is here!")
})

app.use("/", (req, res) => {
    res.send("o page is here!")
})

app.use("/test", (req, res) => {
    res.send("this is test page!")
})

app.listen(3000, () => {
    console.log("Server listening at 3000")
})
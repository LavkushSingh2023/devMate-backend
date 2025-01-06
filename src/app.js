const express = require("express")
const {adminAuth, userAuth} = require("./middlewares/auth")    
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

app.use(express.json())

app.post("/signup", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        res.send("User added successfully!")
    }catch(err){
        res.status(404).send("Error happend to adding the user: " + err.message)
    }
})

connectDB()
    .then(() => {
        console.log("Database connection established successfully!")
        app.listen(3000, () => {
        console.log("Server listening on port:3000")
        })
    })
    .catch((err) => {
        console.error("Unable to connect with database: "+ err.message)
    })
const express = require("express")
const {adminAuth, userAuth} = require("./middlewares/auth")    
const connectDB = require("./config/database")
const User = require("./models/user")

const app = express()

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.send("User added successfully!")
    }catch(err){
        res.status(404).send("Error happend to adding the user: " + err.message)
    }
})

app.get("/users", async (req, res) => {
    try{
        const users = await User.find({emailId: req.body.emailId})
        res.send(users)
    }catch(err){
        res.status(400).send("Unable to get users data: ", err.message)
    }
})

app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("Unable to get users data: ", err.message)
    }
})

app.patch("/users", async (req, res) => {
    try{
        const data = req.body
        const user = await User.findOneAndUpdate({emailId: data.emailId}, data, {returnDocument: "after"})
        console.log(user)
        res.send("User updated successfully!")
    }catch(err){
        res.status(404).send("Unable to update user!", err.message)
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
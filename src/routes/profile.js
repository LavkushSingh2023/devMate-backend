const express = require("express")
const {userAuth} = require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const {validateEditProfileData} = require("../utils/validation")

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const cookie = req.cookies
        const {token} = cookie
        
        const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)
        const {_id} = decodedMessage

        const user = await User.findById({_id})
        if(!user){
            throw new Error("User does not exist!")
        }

        res.send(user)
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("These fields are not allowed to update!")
        }

        const loggInUser = req.user

        Object.keys(req.body).forEach((value) => 
            loggInUser[value] = req.body[value]
        )

        await loggInUser.save()

        res.json({
            message: `${loggInUser.name}, your profile updated successfully!`,
            "Updated User": loggInUser
        })
    }catch(err){
        res.status(400).send("Error in updating profile: " + err.message)
    }
})

profileRouter.get("/auth/validate", async (req, res) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token!" });
  }
});

module.exports = profileRouter
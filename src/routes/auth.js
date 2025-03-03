const express = require("express")
const {validateSignupData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
    try{
        validateSignupData(req)
        const {name, role, bio, avatar, skills, rating, email, password} = req.body
        const bcryptPassword = await bcrypt.hash(password, 10)
        const user = new User({
            name,
            role,
            bio,
            avatar,
            skills,
            rating,
            email,
            password: bcryptPassword
        })
        await user.save()

        const token = await user.getJWT()
        res.cookie("token", token)
        
        res.send("User added successfully!")
    }catch(err){
        res.status(404).send("Error happend to adding the user: " + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})

        if(!user){
            throw new Error("emailId is not present in DB!")
        }

        const isValidPassword = await user.validatePassword(password)

        if(isValidPassword){
            const token = await user.getJWT()

            const isProd = process.env.NODE_ENV === "production";

                res.cookie("token", token, {
                httpOnly: true,
                secure: isProd,                   // true in production (HTTPS)
                sameSite: isProd ? "none" : "lax",  // "none" for production cross-site cookies
            });

            res.json({
                message: "User loggedIn successfully!",
                user
        })
        }else{
            throw new Error("please enter correct password!")
        }
    }catch(err){
        res.status(500).send("Credentials not valid: " + err.message)
    }
})

authRouter.post("/logout", (req, res) => {
    res
        .cookie("token", null, {
        expires: new Date(Date.now())
        })
        .send(`User logged out successfully!`)
})

module.exports = authRouter
const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName Age gender photoUrl"


userRouter.get(
    "/user/requests/received",
    userAuth,
    async (req, res) => {
        try{
            const loggedInUser = req.user

            const connectionRequests = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "accepted"
            }).populate(
                "fromUserId", USER_SAFE_DATA
            )

            console.log(connectionRequests)

            res.json({
                message: "Data fetched successfully!",
                connectionRequests
            })
        }catch(err){
            res.send("Error: " + err.message)
        }
    })

userRouter.get(
    "/user/connections",
    userAuth,
    async (req, res) => {
        try{
            const loggedInUser = req.user

            const connectionRequests = await ConnectionRequest.find({
                $or: [
                    {fromUserId: loggedInUser._id, status: "accepted"},
                    {toUserId: loggedInUser._id, status: "accepted"}
                ]
            }).populate("fromUserId", USER_SAFE_DATA)
              .populate("toUserId", USER_SAFE_DATA)

            const data = connectionRequests.map((row) => {
                if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId
                }
                return row.fromUserId
            })

            res.json({data})
        }catch(err){
            res.status(400).json({Error: err.message})
        }
    }
)

userRouter.get(
    "/feed",
    userAuth,
    async (req, res) => {
        try{
            const {page, limit} = req.query
            const skip = (page - 1) * limit

            const loggedInUser = req.user

            const connectionRequests = await ConnectionRequest.find({
                $or: [
                    {fromUserId: loggedInUser._id},
                    {toUserId: loggedInUser._id}
                ]
            }).select("fromUserId toUserId")
             
            let hiddenUsersFromFeed = new Set()
            connectionRequests.forEach((req) => {
                hiddenUsersFromFeed.add(req.fromUserId.toString())
                hiddenUsersFromFeed.add(req.toUserId.toString())
            });

            const users = await User.find({
                $and: [
                    {_id: {$nin: Array.from(hiddenUsersFromFeed)}},
                    {_id: {$ne: loggedInUser._id}}
                ]
            }).select(USER_SAFE_DATA)
              .skip(skip)
              .limit(limit)

            res.json(users)
        }catch(err){
            res.status(400).json({Error: err.message})
        }
    }
)

    module.exports = userRouter


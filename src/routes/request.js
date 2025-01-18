const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const user = require("../models/user")

const requestRouter = express.Router()

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
    try{
        const fromUserId = req.user._id
        const {status, toUserId} = req.params

        const isAllowedStatus = ["interested", "ignored"]
        if(!isAllowedStatus.includes(status)){
            throw new Error(`"${status}" status is not valid!`)
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            throw new Error("Connection request already exist!")
        }

        const toUser = await user.findOne({_id: toUserId})
        if(!toUser){
            throw new Error("User does not exist!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
        })
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try{
            const loggedInUser = req.user
            const {status, requestId} = req.params

            const isAllowedStatus = ["accepted", "rejected"]
            if(!isAllowedStatus.includes(status)){
                throw new Error(`"${status}" is not a valid status!`)
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            })

            const sender = await user.findById(connectionRequest.fromUserId)

            if(!connectionRequest){
                throw new Error(`Connection request not found!`)
            }

            connectionRequest.status = status
            const data = await connectionRequest.save()

            res.send({
                message: `${loggedInUser.firstName} ${status} connection request of ${sender.firstName}`,
                data
            })
        }catch(err){
            res.status(400).send("Error: " + err.message)
        }
    }
)

module.exports = requestRouter

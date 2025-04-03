const { userAuth } = require("../middlewares/auth")
const { requestSendingController, requestReviewController } = require("../controllers/request")
const express = require("express")

const requestRouter = express.Router()

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    requestSendingController
  )

requestRouter.post(
    "/request/review/:status",
    userAuth,
    requestReviewController
)

module.exports = requestRouter

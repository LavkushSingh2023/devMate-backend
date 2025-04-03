const { userAuth } = require("../middlewares/auth")
const { userRequestsReceivedController, userConnectionsController, userFeedController, allUsersController, allRequestsController } = require("../controllers/user")
const express = require("express")

const userRouter = express.Router()

userRouter.get(
    "/user/requests/received",
    userAuth,
    userRequestsReceivedController
    )

userRouter.get(
    "/user/connections",
    userAuth,
    userConnectionsController
)

userRouter.get(
    "/feed",
    userAuth,
   userFeedController
)

userRouter.get("/allUsers",
    userAuth,
   allUsersController
)

userRouter.get("/allRequests/:id",
     userAuth,
   allRequestsController
    )

    module.exports = userRouter


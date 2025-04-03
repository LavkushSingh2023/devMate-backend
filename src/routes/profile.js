const {userAuth} = require("../middlewares/auth")
const express = require("express")
const { profileViewController, authValidateController } = require("../controllers/profile")

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, profileViewController)

profileRouter.patch("/profile/edit", userAuth, profileViewController)

profileRouter.get("/auth/validate", authValidateController);

module.exports = profileRouter
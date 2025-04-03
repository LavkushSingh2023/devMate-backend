const { signupController, loginController, logoutController, sendEmailController } = require("../controllers/auth")
const express = require("express")

const authRouter = express.Router()

authRouter.post("/signup", signupController)

authRouter.post("/login", loginController)

authRouter.post("/logout", logoutController)

authRouter.post("/send-email", sendEmailController);

module.exports = authRouter
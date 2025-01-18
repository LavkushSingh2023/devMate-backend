const express = require("express")
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   // origin: "http://localhost:5173/login",
    credentials: true
})) 

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

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
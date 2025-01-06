const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://singhlavkush2023:LsT00000@cluster0.d9sci.mongodb.net/devTinder")
}

module.exports = connectDB
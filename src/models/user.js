const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 4 characters"],
      maxLength: [50, "Name must not exceed 50 characters"],
      trim: true,
    },
    role: {
      type: String,
      default: "User",
    //   enum: ["User", "Admin", "Developer", "Designer"],
    },
    bio: {
      type: String,
      trim: true,
      maxLength: [300, "Bio cannot exceed 300 characters"],
    },
    avatar: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid avatar URL",
      },
    },
    skills: {
      type: [String], // Array of skill strings
      default: [],
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [5, "Password must be at least 6 characters"],
    },
},
{
    timestamps: true
}
)

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const isPasswordValid = bcrypt.compare(passwordInputByUser, this.password)
    return isPasswordValid
} 

module.exports = mongoose.model("User", userSchema)
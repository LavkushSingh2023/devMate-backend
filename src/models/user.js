const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(`${value}: is not a valid emailId`)
            }
        } 
    },
    password: {
        type: String
    },
    Age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error(`${value}: is not a valid gender`)
            }
        }
    },
    photoUrl:{
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(`${value}: is not a valid photoUrl`)
            }
        }
    },
},
{
    timestamps: true
}
)

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({_id: user._id}, "devTinder@123", {expiresIn: "1d"})

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const isPasswordValid = bcrypt.compare(passwordInputByUser, this.password)
    return isPasswordValid
} 

module.exports = mongoose.model("User", userSchema)
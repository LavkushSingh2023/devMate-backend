const validator = require("validator")

const validateSignupData = (req) => {
    const {name, role, bio, avatar, skills, rating, email, password} = req.body
    if(!name){
        throw new Error("name is not valid!")
    }else if(!validator.isEmail(email)){
        throw new Error("Please enter valid email!")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password!")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["name", "role", "bio", "avatar", "skills", "rating"]; // Use an array

    const isEditAllowed = Object.keys(req.body).every((field) => 
        allowedEditFields.includes(field) // Check if the field is in the allowed list
    );

    return isEditAllowed;
};

module.exports = {
    validateSignupData,
    validateEditProfileData
}
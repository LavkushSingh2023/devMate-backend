const validator = require("validator")

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName){
        throw new Error("Name is not valid!")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid emailId!")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password!")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "Age", "gender"]; // Use an array

    const isEditAllowed = Object.keys(req.body).every((field) => 
        allowedEditFields.includes(field) // Check if the field is in the allowed list
    );

    return isEditAllowed;
};

module.exports = {
    validateSignupData,
    validateEditProfileData
}
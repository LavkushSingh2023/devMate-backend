const { validateEditProfileData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const profileViewController = async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById({ _id });
    if (!user) {
      throw new Error("User does not exist!");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const profileEditController = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("These fields are not allowed to update!");
    }

    const loggInUser = req.user;

    Object.keys(req.body).forEach(
      (value) => (loggInUser[value] = req.body[value])
    );

    await loggInUser.save();

    res.json({
      message: `${loggInUser.name}, your profile updated successfully!`,
      "Updated User": loggInUser,
    });
  } catch (err) {
    res.status(400).send("Error in updating profile: " + err.message);
  }
};

const authValidateController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = {
  profileViewController,
  profileEditController,
  authValidateController,
};

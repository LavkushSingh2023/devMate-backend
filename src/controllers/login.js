export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("emailId is not present in DB!");
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = await user.getJWT();

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd, // true in production (HTTPS)
        sameSite: isProd ? "none" : "lax", // "none" for production cross-site cookies
      });

      res.json({
        message: "User loggedIn successfully!",
        user,
      });
    } else {
      throw new Error("please enter correct password!");
    }
  } catch (err) {
    res.status(500).send("Credentials not valid: " + err.message);
  }
};

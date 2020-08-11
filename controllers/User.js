const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    //check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    //check email format
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Email do not match correct format",
      });
    }
    //check if email is already registered
    let userEmail = await User.findOne({ email });
    if (userEmail) {
      return res
        .status(400)
        .json({ message: "email already associated with an account" });
    }
    user = new User({
      username,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); //send token on successful registration
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, process.env.SECRET, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(400).json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

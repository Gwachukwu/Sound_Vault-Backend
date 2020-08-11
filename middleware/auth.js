const jwt = require("jsonwebtoken");
require("dotenv").config({path: __dirname + '/.env'});

module.exports = function (req, res, next) {
  const token = req.header("authorization");
  if (!token) {
    return res.status(401).json({ msg: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "unauthorized" });
  }
};
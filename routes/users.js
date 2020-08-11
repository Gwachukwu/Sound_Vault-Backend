const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { signUp, signIn, userDetails } = require("../controllers/User");

router.post("/users/signup", signUp);

router.post("/users/signin", signIn);

router.get("/users/details", auth, userDetails);

module.exports = router;
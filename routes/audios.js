const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const multer = require("multer");

const data = multer();
const Audio = require("../models/audioModel");
//const User = require('../../../models/User');
const parser = require("../config/audioUploadConfig");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /car
// @desc    Create a car sale ad
// @access  Private
router.post("/file/audio", parser.single("audio"), auth, (req, res) => {
  let { name } = req.body;
  //   name = state.toLowerCase();
  //   status = status.toLowerCase();
  //   manufacturer = manufacturer.toLowerCase();
  //   body_type = body_type.toLowerCase();
  let audio = req.file;
  console.log(audio,"hjhjj");
  const user_id = req.user.id;
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, error: "Please name your soundtrack" });
  }
  if (!audio) {
    return res
      .status(400)
      .json({ status: 400, error: "Please upload a soundtrack" });
  }
  if (audio.size > 5000000) {
    return res
      .status(400)
      .json({ status: 400, error: "Please upload an audio less than 5mb" });
  }
  audio = {
    public_ID: audio.public_id,
    public_url: audio.url,
  };
  const newAudio = new Audio({
    name,
    audio,
    user_id,
  });
  newAudio
    .save()
    .then((audio) =>
      res.status(200).json({
        status: 200,
        message: "Soundtrack successfully uploaded",
        audio,
      })
    )
    .catch(() =>
      res.status(400).json({
        status: 400,
        error: "Unable to add soundtrack",
      })
    );
    next();
});

module.exports = router;

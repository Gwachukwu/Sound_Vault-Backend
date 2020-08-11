const express = require("express");
const multer = require("multer");

const { uploadAudio, getAudioFiles } = require("../controllers/Audio");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/audio",
  auth,
  multer({
    dest: "temp/",
    limits: {
      fieldSize: 8 * 1024 * 1024,
    },
  }).single("media"),
  uploadAudio
);

router.get("/files", auth, getAudioFiles);

module.exports = router;

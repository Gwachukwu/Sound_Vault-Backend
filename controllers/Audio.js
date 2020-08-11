const cloudinary = require("cloudinary").v2;
const Audio = require("../models/audioModel");

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadAudio = async (req, res, next) => {
  let { name } = req.body;
  let audio = req.file;
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
  try {
    // upload audio to cloudinary
    cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",
        public_id: `audio/${req.file.filename}`,
        overwrite: true,
        notification_url: "http://127.0.0.1:3000/file/audio",
      },
      async function (error, result) {
        if (error) {
          res.status(500).json({
            success: false,
            message: "There was an error uploading audio",
          });
        }
        let audio_data = {
          public_ID: result.public_id,
          public_url: result.url,
        };

        const newAudio = await Audio.create({
          name,
          audio: audio_data,
          user_id,
        });
        if (newAudio) {
          return res.status(200).json({
            status: 200,
            message: "Soundtrack successfully uploaded",
            audio: newAudio,
          });
        }
        return res.status(400).json({
          status: 400,
          error: "Unable to add soundtrack",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      error: "An internal server error occured",
    });
  }
};

exports.getAudioFiles = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const audiofiles = await Audio.find({user_id});
    return res.status(400).json({
      files: audiofiles      
    });
  } catch (error) {
    return res.status(500).json({
      error: "An internal server error occured",
    });
  }
};

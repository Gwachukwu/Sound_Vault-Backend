const multer = require('multer');
const cloudinary = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require("dotenv").config({path: __dirname + '/.env'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'audio_files',
  allowedFormats: ['mp3'],
  format: async () => 'mp3',
  resource_type: 'video',
  public_id: (req, file) => file.originalname,
  //transformation: [{ width: 500, height: 500, crop: 'limit' }],
});
const parser = multer({ storage });


module.exports = parser;
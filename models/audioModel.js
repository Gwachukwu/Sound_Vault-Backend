const mongoose = require("mongoose");

const audioSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  audio: [
    {
      public_ID: {
        type: String,
        required: true,
      },
      public_url: {
        type: String,
        required: true,
      },
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model("audio", audioSchema);
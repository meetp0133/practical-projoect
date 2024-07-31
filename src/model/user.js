const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      default: 1,
      enum: [1, 2, 3],
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    }
  },
  { collection: "user", timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

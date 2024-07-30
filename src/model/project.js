const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    status : {
        type : Number,
        default : 1,
        enum : [1,2,3]
    },
    projectName: {
      type: String,
    },
    descripion: {
      type: String,
      lowercase: true,
    },
    userIds
     : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
  },
  { collection: "project", timestamps: true }
);

const projectModel = mongoose.model("project", projectSchema);
module.exports = projectModel;

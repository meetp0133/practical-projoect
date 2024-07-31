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
    description: {
      type: String,
      lowercase: true,
    }
  },
  { collection: "project", timestamps: true }
);

const projectModel = mongoose.model("project", projectSchema);
module.exports = projectModel;

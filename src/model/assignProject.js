const mongoose = require("mongoose");

const assignProjectSchema = new mongoose.Schema(
    {
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3]
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    { collection: "assignProject", timestamps: true }
);

const assignProjectModel = mongoose.model("assignProject", assignProjectSchema);
module.exports = assignProjectModel;

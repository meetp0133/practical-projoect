const { ACTIVE_STATUS } = require("../../config/key");
const { sortBy, searchHelper, facetHelper } = require("../helpers/helper");
const Project = require("../model/project");
const { ObjectId } = require('mongoose').Types;


module.exports.projectListView = async (data) => {
    try {
        let pipeline = []

        if(data.userId){
            pipeline.push({
                $match :{
                    _id : new ObjectId(data.projectId)
                }
            })
        }

        pipeline.push(
            {
                $match:
                {
                    status: ACTIVE_STATUS,
                },
            },
            {
                $lookup: {
                    from: "assignProject",
                    localField: "_id",
                    foreignField: "projectId",
                    pipeline: [{
                        $match: { status: ACTIVE_STATUS }
                    }],
                    as: "assignProjectData",
                },
            },
            {
                $unwind: {
                    path: "$assignProjectData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "assignProjectData.userId",
                    foreignField: "_id",
                    pipeline: [{
                        $match: { status: ACTIVE_STATUS }
                    }],
                    as: "userData",
                },
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    userDetails: {
                        $mergeObjects: [
                            "$assignProjectData",
                            "$userData",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    projectName: {
                        $first: "$projectName",
                    },
                    description: {
                        $first: "$description",
                    },
                    userDetails: {
                        $push: "$userDetails",
                    },
                },
            }
        )

        if (data.search) {
            let fieldsArray = ["projectName", "description"];
            pipeline.push(searchHelper(data.search, fieldsArray));
        }
        let sort = sortBy(data.sortBy, data.sortKey)
        pipeline.push(
            { $sort: sort },
            facetHelper(Number(data.skip), Number(data.limit))
        );

        return await Project.aggregate(pipeline)
    } catch (err) {
        console.log(`Error(projectListView)`, err);
    }
}
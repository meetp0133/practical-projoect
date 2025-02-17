const { ACTIVE_STATUS } = require("../../config/key");
const { sortBy, searchHelper, facetHelper } = require("../helpers/helper");
const User = require("../model/user");
const { ObjectId } = require('mongoose').Types;


module.exports.userListView = async (data) => {
    try {
        let pipeline = []

        if(data.userId){
            pipeline.push({
                $match :{
                    _id : new ObjectId(data.userId)
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
                    foreignField: "userId",
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
                    from: "project",
                    localField: "assignProjectData.projectId",
                    foreignField: "_id",
                    pipeline: [{
                        $match: { status: ACTIVE_STATUS }
                    }],
                    as: "projectData",
                },
            },
            {
                $unwind: {
                    path: "$projectData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    projects: {
                        $mergeObjects: [
                            "$assignProjectData",
                            "$projectData",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    fullName: {
                        $first: "$fullName",
                    },
                    email: {
                        $first: "$email",
                    },
                    projects: {
                        $push: "$projects",
                    },
                },
            }
        )

        if (data.search) {
            let fieldsArray = ["fullName", "email"];
            pipeline.push(searchHelper(data.search, fieldsArray));
        }
        let sort = sortBy(data.sortBy, data.sortKey)
        pipeline.push(
            { $sort: sort },
            facetHelper(Number(data.skip), Number(data.limit))
        );

        return await User.aggregate(pipeline)
    } catch (err) {
        console.log(`Error(userListView)`, err);
    }
}
const User = require("../model/user");


module.exports.userListView = async (data) => {
    try {
        let pipeline = []
        pipeline.push(
            {
                $unwind: {
                    path: "$projectIds",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "project",
                    localField: "projectIds",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: {
                    path: "$result",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    fullName: {
                        $first: "$fullName"
                    },
                    email: {
                        $first: "$email"
                    },
                    projects: {
                        $push: "$result"
                    }
                }
            }
        )

        return await User.aggregate(pipeline)
    } catch (err) {
        console.log(`Error(userListView)`, err);
    }
}
const { SERVERERROR, SUCCESS, ACTIVE_STATUS } = require("../../../config/key");
const User = require("../../model/user");
const { userListView } = require("../../service/user.service");
const AssignProject = require("../../model/assignProject");
const { listUserDetailsTransformer, viewUserDetailsTransformer } = require("../../transformer/user.transformer");
const { getPageAndLimit } = require("../../helpers/helper");

module.exports.addEditUser = async (req, res) => {
  try {
    const reqBody = req.body;
    let message = "userAdded", existingUser;

    let query = {
      status: ACTIVE_STATUS,
      email: reqBody.email
    }
    if (reqBody.userId) {
      existingUser = await User.findOne({ _id: reqBody.userId, status: ACTIVE_STATUS });
      if (!existingUser) return res.status(SUCCESS).json({ message: res.__("userNotFound") });

      query["_id"] = { $ne: reqBody.userId }

      message = "userUpdated"
    } else {
      existingUser = new User(reqBody)
    }

    const checkEmailIsExist = await User.findOne(query)
    if (checkEmailIsExist) return res.status(SUCCESS).json({ message: res.__("thisEmailIsAlreadyExist") });

    existingUser.fullName = reqBody?.fullName ? reqBody.fullName : existingUser.fullName
    existingUser.email = reqBody?.email ? reqBody.email : existingUser.email

    await existingUser.save();


    if (reqBody.userId) {
      if (reqBody.projectIds.length > 0) {
        for (const ele of reqBody.projectIds) {
          await AssignProject.updateOne({ projectId: ele, userId: existingUser._id, status: ACTIVE_STATUS }, { $set: { projectId: ele, userId: existingUser._id } }, { upsert: true })
        }
        await AssignProject.deleteOne({ userId: existingUser._id, projectId: { $nin: reqBody.projectIds }, status: ACTIVE_STATUS })

      }
    } else {
      if (reqBody.projectIds.length > 0) {
        for (const element of reqBody.projectIds) {
          await AssignProject.create({
            projectId: element,
            userId: existingUser._id,
          })
        }
      }
    }


    return res.status(SUCCESS).json({ message: res.__(message), data: existingUser })
  } catch (err) {
    console.log(`Error(addEditUser)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
};

module.exports.userList = async (req, res) => {
  try {
    const reqBody = req.body;
    const { limitCount, skipCount } = getPageAndLimit(reqBody.page, reqBody.limit);

    const listUsers = await userListView({
      search: reqBody.search,
      sortBy: reqBody.sortBy,
      sortKey: reqBody.sortKey,
      skip: skipCount,
      limit: limitCount,
    })

    let response = listUsers && listUsers.length > 0 ? listUserDetailsTransformer(listUsers[0].data) : [];
    let totalCount = listUsers && listUsers.length > 0 && listUsers[0].totalRecords[0] ? listUsers[0].totalRecords[0].count : 0;

    return res.status(SUCCESS).json({ message: res.__('userListed'), totalCount, data: response })

  } catch (err) {
    console.log(`Error(userList)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
}

module.exports.viewUserDetails = async (req, res) => {
  try {
    const reqBody = req.body;

    const listUsers = await userListView({
      userId: reqBody.userId
    })
    if (listUsers[0].data.length == 0) return res.status(SUCCESS).json({ message: res.__("userNotFound") });

    let response = listUsers && listUsers.length > 0 ? viewUserDetailsTransformer(listUsers[0].data[0]) : [];

    return res.status(SUCCESS).json({ message: res.__('userDataFetched'), data: response })

  } catch (err) {
    console.log(`Error(viewUserDetails)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
}

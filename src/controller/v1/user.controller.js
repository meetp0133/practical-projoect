const { SERVERERROR, SUCCESS, ACTIVE_STATUS } = require("../../../config/key");
const User = require("../../model/user");
const { userListView } = require("../../service/user.service");

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
    existingUser.projectIds = reqBody?.projectIds ? reqBody.projectIds : existingUser.projectIds

    await existingUser.save();

    return res.status(SUCCESS).json({ message: res.__(message), data: existingUser })
  } catch (err) {
    console.log(`Error(addEditUser)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
};


module.exports.userList = async (req, res) => {
  try {
      const listUsers = await userListView()
    return res.status(SUCCESS).json({ message: res.__('userListed'), data: listUsers })

  } catch (err) {
    console.log(`Error(userList)`, err);
  }
}

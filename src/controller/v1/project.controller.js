const { ACTIVE_STATUS, SUCCESS, DELETED_STATUS } = require("../../../config/key");
const Project = require("../../model/project");
const AssignProject = require("../../model/assignProject");
const { projectListView } = require("../../service/project.service");
const { getPageAndLimit } = require("../../helpers/helper");
const { listProjectDetailsTransformer, viewProjectDetailsTransformer } = require("../../transformer/project.transformer");

module.exports.addEditProject = async (req, res) => {
  try {
    const reqBody = req.body;
    let message = "projectAdded", existingProject;

    if (reqBody.projectId) {
      existingProject = await Project.findOne({ _id: reqBody.projectId, status: ACTIVE_STATUS })
      if (!existingProject) return res.status(SUCCESS).json({ message: res.__("projectNotFound") });

      userIds = existingProject.userIds || []

      message = "projectUpdated"
    } else {
      existingProject = new Project(reqBody)
    }

    existingProject.projectName = reqBody?.projectName ? reqBody.projectName : existingProject.projectName
    existingProject.description = reqBody?.description ? reqBody.description : existingProject.description

    await existingProject.save();

    if (reqBody.projectId) {
      if (reqBody.userIds.length > 0) {
        for (const ele of reqBody.userIds) {
          await AssignProject.updateOne({ projectId: reqBody.projectId, userId: ele, status: ACTIVE_STATUS }, { $set: { projectId: reqBody.projectId, userId: ele } }, { upsert: true })
        }
        await AssignProject.deleteOne({ projectId: reqBody.projectId, userId: { $nin: reqBody.userIds }, status: ACTIVE_STATUS })

      }
    } else {
      if (reqBody.userIds.length > 0) {
        for (const element of reqBody.userIds) {
          await AssignProject.create({
            projectId: existingProject._id,
            userId: element,
          })
        }
      }
    }

    return res.status(SUCCESS).json({ message: res.__(message), data: existingProject })

  } catch (err) {
    console.log(`Error(addEditProject)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });

  }
};


module.exports.projectList = async (req, res) => {
  try {
    const reqBody = req.body;
    const { limitCount, skipCount } = getPageAndLimit(reqBody.page, reqBody.limit);

    const listProject = await projectListView({
      search: reqBody.search,
      sortBy: reqBody.sortBy,
      sortKey: reqBody.sortKey,
      skip: skipCount,
      limit: limitCount,
    })

    let response = listProject && listProject.length > 0 ? listProjectDetailsTransformer(listProject[0].data) : [];
    let totalCount = listProject && listProject.length > 0 && listProject[0].totalRecords[0] ? listProject[0].totalRecords[0].count : 0;

    return res.status(SUCCESS).json({ message: res.__('projectListed'), totalCount, data: response })

  } catch (err) {
    console.log(`Error(projectList)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
}

module.exports.viewProjectDetails = async (req, res) => {
  try {
    const reqBody = req.body;

    const listProject = await projectListView({
      projectId: reqBody.projectId
    })
    if (listProject[0].data.length == 0) return res.status(SUCCESS).json({ message: res.__("projectNotFound") });

    let response = listProject && listProject.length > 0 ? viewProjectDetailsTransformer(listProject[0].data[0]) : [];

    return res.status(SUCCESS).json({ message: res.__('projectDataFetched'), data: response })

  } catch (err) {
    console.log(`Error(viewProjectDetails)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  }
}


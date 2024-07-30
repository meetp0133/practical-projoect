const { ACTIVE_STATUS, SUCCESS } = require("../../../config/key");
const Project = require("../../model/project");

module.exports.addEditProject = async (req, res) => {
  try {
    const reqBody = req.body;
    let message = "projectAdded", existingProject;

    if (reqBody.projectId) {
      existingProject = await Project.findOne({_id : reqBody.projectId,status: ACTIVE_STATUS})
      if(!existingProject) return res.status(SUCCESS).json({ message: res.__("projectNotFound") });

      message = "projectUpdated"
    } else {
        existingProject = new Project(reqBody)      
    }

    existingProject.projectName = reqBody?.projectName ? reqBody.projectName : existingProject.projectName
    existingProject.descripion = reqBody?.descripion ? reqBody.descripion : existingProject.descripion
    existingProject.userIds = reqBody?.userIds ? reqBody.userIds : existingProject.userIds

    await existingProject.save();
    return res.status(SUCCESS).json({ message: res.__(message), data: existingProject })
  
  } catch (err) {
    console.log(`Error(addEditProject)`, err);
    return res.status(SERVERERROR).json({ message: res.__('somethingWentWrongPleaseTryAgain') });
  
  }
};

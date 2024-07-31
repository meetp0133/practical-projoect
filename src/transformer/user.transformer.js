exports.transform = (data) => {
    return {
        userId: data?._id ? data._id : "",
        fullName: data?.fullName ? data.fullName : "",
        email: data?.email ? data.email : "",
        projects: data?.projects ? module.exports.listProjectsTransformer(data.projects) : [],
    };
};

exports.viewUserDetailsTransformer = (arrayData) => {
    let data = null;
    if (arrayData) {
        data = this.transform(arrayData);
    }
    arrayData = data;
    return arrayData;
};

exports.listUserDetailsTransformer = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transform(a));
        });
    };
    arrayData = data;
    return arrayData
};

//ProjectData list
exports.projectTransform = (data) => {
    return {
        projectId: data?.projectId ? data.projectId : "",
        userId: data?.userId ? data.userId : "",
        projectName: data?.projectName ? data.projectName : "",
        description: data?.description ? data.description : ""
    };
};

exports.listProjectsTransformer = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.projectTransform(a));
        });
    };
    arrayData = data;
    return arrayData
};
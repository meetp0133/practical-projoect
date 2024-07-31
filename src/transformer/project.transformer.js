exports.transform = (data) => {
    return {
        projectId: data?._id ? data._id : "",
        projectName: data?.projectName ? data.projectName : "",
        description: data?.description ? data.description : "",
        userDetails: (data?.userDetails && data?.userDetails[0]?.projectId) ? module.exports.listuserTransformer(data.userDetails) : [],
    };
};

exports.viewProjectDetailsTransformer = (arrayData) => {
    let data = null;
    if (arrayData) {
        data = this.transform(arrayData);
    }
    arrayData = data;
    return arrayData;
};

exports.listProjectDetailsTransformer = (arrayData,baseUrl) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.transform(a,baseUrl));
        });
    };
    arrayData = data;
    return arrayData
};

//UserData list
exports.userTransform = (data) => {
    return {
        projectId: data?.projectId ? data.projectId : "",
        userId: data?.userId ? data.userId : "",
        fullName: data?.fullName ? data.fullName : "",
        email: data?.email ? data.email : ""
    };
};

exports.listuserTransformer = (arrayData) => {
    let data = [];
    if (arrayData && arrayData.length > 0) {
        arrayData.forEach((a) => {
            data.push(this.userTransform(a));
        });
    };
    arrayData = data;
    return arrayData
};
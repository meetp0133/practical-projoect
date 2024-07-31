const { FAILURE } = require("../../config/key");

const getPageAndLimit = (page, limit) => {
    if (!page) page = 1;
    if (!limit) limit = 10;
    let limitCount = limit * 1;
    let skipCount = (page - 1) * limitCount;
    return { limitCount, skipCount };

};

const facetHelper = (skip, limit) => {
    let obj = {
        $facet: {
            data: [
                {
                    $skip: Number(skip) < 0 ? 0 : Number(skip) || 0,
                },
                {
                    $limit: Number(limit) < 0 ? 10 : Number(limit) || 10,
                },
            ],
            totalRecords: [
                {
                    $count: 'count',
                },
            ],
        },
    };
    return obj;
};

const searchHelper = (searchField, fields) => {
    let orArr = [];
    let search = [];
    searchField = searchField.replace(/[\*()+?[]/g, '');
    searchField = searchField.replace(']', '');
    search[0] = searchField.trim();

    fields.forEach((element1) => {
        search.forEach((element) => {
            orArr.push({ [element1]: { $regex: new RegExp(element, 'i') } });
        });
    });
    return { $match: { $or: orArr } };
};

const sortBy = (sortBy, sortKey) => {
    let obj = {};
    sortBy = sortBy ? sortBy : -1;
    sortBy = parseInt(sortBy);
    sortKey = sortKey ? sortKey : 'createdAt';
    obj[sortKey] = sortBy;
    return obj;
};


const toUpperCaseValidation = (str) => {
    if (str?.length) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return '';
};

const validationMessageKey = (apiTag, error) => {
    let key = module.exports.toUpperCaseValidation(error.details[0].context.key);
    let type = error.details[0].type.split('.');
    type[1] = type[1] === 'empty' ? 'required' : type[1];
    type = module.exports.toUpperCaseValidation(type[1]);
    key = apiTag + key + type;
    return key;
};

//send validator response
const validatorFunction = async (req, res, next = null) => {
    try {

        if (req?.validationMessage) return res.status(FAILURE).json({ message: res.__(req.validationMessage) })     

        next();
    } catch (err) {
        console.log('Error(validatorFunction)', err);
    }
};
module.exports = {
    getPageAndLimit,
    facetHelper,
    searchHelper,
    sortBy,
    validationMessageKey,
    toUpperCaseValidation,
    validatorFunction
}
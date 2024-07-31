const Joi = require('joi');
const { validationMessageKey } = require('../helpers/helper');
Joi.objectId = require('joi-objectid')(Joi);

exports.addEditProjectValidation = (req, res, next) => {
    let projectSchema
    if (req.body && req.body.projectId) {
        projectSchema = Joi.object({
            projectId: Joi.objectId().required(),
            projectName: Joi.string().optional().allow("", null),
            description: Joi.string().optional().allow("", null)
        }).unknown(true);
    } else {
        projectSchema = Joi.object({
            projectName: Joi.string().required(),
            description: Joi.string().required()
        }).unknown(true);
    }
    const { error } = projectSchema.validate(req.body)
    if (error) {
        req.validationMessage = validationMessageKey('validation', error);
    }
    next();
};

exports.viewProjectValidation = (req, res, next) => {
    let projectSchema = Joi.object({
        projectId: Joi.objectId().required(),
    }).unknown(true);
    const { error } = projectSchema.validate(req.body)
    if (error) {
        req.validationMessage = validationMessageKey('validation', error);
    }
    next();
};
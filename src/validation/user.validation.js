const Joi = require('joi');
const { validationMessageKey } = require('../helpers/helper');
Joi.objectId = require('joi-objectid')(Joi);

exports.addEditUserValidation = (req, res, next) => {
    let userSchema
    if (req.body && req.body.userId) {
        userSchema = Joi.object({
            userId: Joi.objectId().required(),
            fullName: Joi.string().optional().allow("", null),
            email: Joi.string().optional().allow("", null).email(),
        }).unknown(true);
    } else {
        userSchema = Joi.object({
            fullName: Joi.string().required(),
            email: Joi.string().required().email()
        }).unknown(true);
    }
    const { error } = userSchema.validate(req.body)
    if (error) {
        req.validationMessage = validationMessageKey('validation', error);
    }
    next();
};

exports.viewUserValidation = (req, res, next) => {
    let userSchema = Joi.object({
        userId: Joi.objectId().required(),
    }).unknown(true);
    const { error } = userSchema.validate(req.body)
    if (error) {
        req.validationMessage = validationMessageKey('validation', error);
    }
    next();
};
const Joi = require("@hapi/joi");

const signUpValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required()
    });

    return schema.validate(data);

}
module.exports.signUpValidation = signUpValidation;
const Joi = require("@hapi/joi");

const signUpValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required()
    });


    const { error, value } = schema.validate(data);
    
    if (error)
        return error;

    if (!value)
        return value = {};
        
    return value;

}
module.exports.signUpValidation = signUpValidation;
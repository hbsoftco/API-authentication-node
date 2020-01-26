const Joi = require("@hapi/joi");

module.exports = {

    signUpValidation: (schema) => {
        return (req, res, next) => {
            let { error, value } = schema.validate(req.body);

            if (error)
                return res.status(400).json(error);

            if (!req.value) {
                req.value = {};
            }

            req.value['body'] = value;
            next();
        }

    },
    schema: {
        authSchema: Joi.object({
            email: Joi.string().min(4).required().email()
                .messages({
                    "string.empty": `این فیلد نمی‌تواند خالی باشد!`,
                    "string.base": `"username" should be a type of 'text'`,
                    "any.required": `این فیلد اجباری است!`
                }),
            password: Joi.string().min(4).required().messages({
                "string.base": `"username" should be a type of 'text'`,
                "string.empty": `این فیلد نمی‌تواند خالی باشد!`,
                "any.required": `این فیلد اجباری است!`
            }),
        })
    }

}

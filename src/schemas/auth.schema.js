import joi from 'joi';

const signUpSchema = joi.object({
    name: joi.string().max(255).required(),
    email: joi.string().max(255).email().required(),
    password: joi.string().required(),
    confirmPassword: joi.valid(joi.ref('password')).required()
});

const signInSchema = joi.object({
    email: joi.string().max(255).email().required(),
    password: joi.string().required()
});

export {
    signUpSchema,
    signInSchema
};
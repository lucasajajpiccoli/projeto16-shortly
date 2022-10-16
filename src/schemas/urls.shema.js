import joi from 'joi';

const pattern = new RegExp('^https?://');

const urlsSchema = joi.object({
    url: joi.string().pattern(pattern).required()
});

export {
    urlsSchema
};
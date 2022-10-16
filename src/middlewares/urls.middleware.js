import { urlsSchema } from '../schemas/urls.shema.js';
import { STATUS_CODE } from '../enums/statusCode.js';

function urlsMiddleware(req, res, next) {
    const { body } = req;
    const validation = urlsSchema.validate(body, { abortEarly: false });
    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send(errors);
    }

    res.locals = {
        ...res.locals,
        ...body
    };
    next();
}

export {
    urlsMiddleware
};
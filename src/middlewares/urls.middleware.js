import { connection } from '../database.js';
import { urlsSchema } from '../schemas/urls.shema.js';
import {
    TABLES,
    USERS,
    SHORT_URLS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { serverError } from '../controllers/controllersHelper.js';

function insertUrlMiddleware(req, res, next) {
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

async function removeUrlMiddleware(req, res, next) {
    const { userId } = res.locals;
    const id = Number(req.params.id);
    if(!Number.isInteger(id)) {
        return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }

    try {
        const selection = (await connection.query(
            `SELECT CASE
                WHEN (SELECT COUNT(*) FROM "${TABLES.SHORT_URLS}" WHERE ${SHORT_URLS.ID} = $1) = 0 THEN 404
                WHEN (SELECT COUNT(*) FROM "${TABLES.SHORT_URLS}" WHERE ${SHORT_URLS.ID} = $1 AND "${SHORT_URLS.USER_ID}" = ${userId}) = 0 THEN 401
                ELSE 0
                END
            FROM ${TABLES.USERS} WHERE ${USERS.ID} = ${userId};`,
        [id])).rows[0];

        if(selection.case === 404) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        } else if(selection.case === 401) {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
        }

        res.locals = { shortUrlId: id };
        next();
    } catch (error) {
     serverError(res, error);   
    }
}

export {
    insertUrlMiddleware,
    removeUrlMiddleware
};
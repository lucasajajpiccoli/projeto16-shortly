import { connection } from '../database.js';
import {
    signUpSchema,
    signInSchema
} from '../schemas/auth.schema.js';
import {
    TABLES,
    USERS,
    SESSIONS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { serverError } from '../controllers/controllersHelper.js';

function signUpMiddleware(req, res, next) {
    const { body } = req;
    const validation = signUpSchema.validate(body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send(errors);
    }

    res.locals = body;
    next();
}

async function signInMiddleware(req, res, next) {
    const { body } = req;
    const validation = signInSchema.validate(body, { abortEarly: false });
    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send(errors);
    }
    
    try {
        const user = (await connection.query(
            `SELECT ${USERS.ID}, ${USERS.PASSWORD}
            FROM ${TABLES.USERS} WHERE ${USERS.EMAIL} = $1;`,
        [body.email])).rows;
        if(!user[0]) {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
        }

        res.locals = {
            id: user[0].id,
            hashedPassword: user[0].password,
            password: body.password
        };
        next();
    } catch (error) {
        serverError(res, error);
    }
}

export {
    signUpMiddleware,
    signInMiddleware
};
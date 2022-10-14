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

async function signUpMiddleware(req, res, next) {
    const { body } = req;
    const validation = signUpSchema.validate(body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send(errors);
    }

    try {
        const existentUser = (await connection.query(
            `SELECT * FROM ${TABLES.USERS} WHERE "${USERS.EMAIL}" = $1;`,
            [body.email])).rowCount;
        if (existentUser > 0) {
            return res.sendStatus(STATUS_CODE.CONFLICT);
        }

        res.locals = body;
        next();
    } catch (error) {
        serverError(res, error);
    }
}

export {
    signUpMiddleware
};
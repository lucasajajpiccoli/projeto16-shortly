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
        [body.email])).rows[0];
        if(!user) {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
        }

        res.locals = {
            id: user.id,
            hashedPassword: user.password,
            password: body.password
        };
        next();
    } catch (error) {
        serverError(res, error);
    }
}

async function authenticationMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if(!token) {
        return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    }
    try {
        const session = (await connection.query(
            `SELECT "${SESSIONS.USER_ID}"
            FROM ${TABLES.SESSIONS} WHERE ${SESSIONS.TOKEN} = $1;`,
        [token])).rows[0];
        if(!session) {
            return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
        }

        res.locals = session;
        next();
    } catch (error) {
        serverError(res, error);
    }
}

export {
    signUpMiddleware,
    signInMiddleware,
    authenticationMiddleware
};
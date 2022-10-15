import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import {
    TABLES,
    USERS,
    SESSIONS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { connection } from '../database.js';
import { serverError } from './controllersHelper.js';

async function signUp(req, res) {
    const { name, email, password } = res.locals;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const insertion = (await connection.query(
            `INSERT INTO ${TABLES.USERS} (${USERS.NAME}, ${USERS.EMAIL}, ${USERS.PASSWORD})
            VALUES ($1, $2, $3);`,
        [name, email, hashedPassword])).rowCount;
        if(insertion === 0) {
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }
        res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        if(error.code === "23505") {
          return res.sendStatus(STATUS_CODE.CONFLICT);
        }
        serverError(res, error);
    }
}

async function signIn(req, res) {
    const { id, hashedPassword, password } = res.locals;
    const authorized = bcrypt.compareSync(password, hashedPassword);
    if(!authorized) {
        return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    }

    const token = uuid();
    try {
        const insertion = (await connection.query(
            `INSERT INTO ${TABLES.SESSIONS} ("${SESSIONS.USER_ID}", ${SESSIONS.TOKEN})
            VALUES (${id}, '${token}');`
        )).rowCount;
        if(insertion === 0) {
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }
        res.status(STATUS_CODE.OK).send({ token });
    } catch (error) {
        serverError(res, error);
    }
}

export {
    signUp,
    signIn
};
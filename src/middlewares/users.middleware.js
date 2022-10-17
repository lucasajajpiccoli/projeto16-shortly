import { connection } from '../database.js';
import {
    TABLES,
    USERS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { serverError } from '../controllers/controllersHelper.js';

async function usersMiddleware(req, res, next) {
    const { userId } = res.locals;
    try {
        const selection = (await connection.query(
            `SELECT ${USERS.NAME} FROM ${TABLES.USERS} WHERE ${USERS.ID} = ${userId};`
        )).rows[0];
        
        if(!selection) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }

        const { name } = selection;
        res.locals = {
            userId,
            name
        };
        next();
    } catch (error) {
        serverError(res, error);
    }
}

export {
    usersMiddleware
};
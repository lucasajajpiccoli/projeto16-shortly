import {
    TABLES,
    USERS,
    SHORT_URLS,
    VISITS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { connection } from '../database.js';
import { serverError } from './controllersHelper.js';

async function list(req, res) {
    try {
        const selection = (await connection.query(
            `SELECT
                ${TABLES.USERS}.${USERS.ID},
                ${TABLES.USERS}.${USERS.NAME},
                COUNT(DISTINCT "${TABLES.SHORT_URLS}".${SHORT_URLS.ID}) AS "linksCount",
                COUNT(${TABLES.VISITS}.${VISITS.ID}) AS "visitCount"
            FROM ${TABLES.USERS}
                LEFT JOIN "${TABLES.SHORT_URLS}" ON ${TABLES.USERS}.${USERS.ID} = "${TABLES.SHORT_URLS}"."${SHORT_URLS.USER_ID}"
                LEFT JOIN ${TABLES.VISITS} ON "${TABLES.SHORT_URLS}".${SHORT_URLS.ID} = ${TABLES.VISITS}."${VISITS.SHORT_URL_ID}"
            GROUP BY ${TABLES.USERS}.${USERS.ID}
            ORDER BY
                "visitCount" DESC,
                "linksCount" DESC
            LIMIT 10;`
        )).rows;

        const response = selection.map(
            user => ({
                ...user,
                linksCount: Number(user.linksCount),
                visitCount: Number(user.visitCount)
            })
        );

        res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
        serverError(res, error);
    }
}

export {
    list
};
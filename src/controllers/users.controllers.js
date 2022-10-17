import {
    TABLES,
    SHORT_URLS,
    URLS,
    VISITS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { connection } from '../database.js';
import { serverError } from './controllersHelper.js';

async function list(req, res) {
    const { userId, name } = res.locals;
    try {
        const selection = (await connection.query(
            `SELECT
                "${TABLES.SHORT_URLS}".${SHORT_URLS.ID},
                "${TABLES.SHORT_URLS}"."${SHORT_URLS.SHORT_URL}",
                ${TABLES.URLS}.${URLS.URL},
                COUNT(${TABLES.VISITS}.${VISITS.ID}) AS "visitCount"
            FROM "${TABLES.SHORT_URLS}"
                JOIN ${TABLES.URLS} ON "${TABLES.SHORT_URLS}"."${SHORT_URLS.URL_ID}" = ${TABLES.URLS}.${URLS.ID}
                LEFT JOIN ${TABLES.VISITS} ON ${TABLES.VISITS}."${VISITS.SHORT_URL_ID}" = "${TABLES.SHORT_URLS}".${SHORT_URLS.ID}
            WHERE "${TABLES.SHORT_URLS}"."${SHORT_URLS.USER_ID}" = ${userId}
            GROUP BY
                "${TABLES.SHORT_URLS}".${SHORT_URLS.ID}, 
                ${TABLES.URLS}.${URLS.URL};`
        )).rows;

        let visitCount = 0;
        const shortenedUrls = selection.map(
            shortUrl => ({...shortUrl, visitCount: Number(shortUrl.visitCount)})
        );
        shortenedUrls.forEach(shortUrl => visitCount += shortUrl.visitCount);

        const response = {
            id: userId,
            name,
            visitCount,
            shortenedUrls
        };

        res.status(STATUS_CODE.OK).send(response);
    } catch (error) {
        serverError(res, error);
    }
}

export {
    list
};
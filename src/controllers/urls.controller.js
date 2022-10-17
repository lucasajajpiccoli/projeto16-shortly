import { customAlphabet } from 'nanoid';

import {
    TABLES,
    URLS,
    SHORT_URLS,
    VISITS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { NANOID } from '../enums/nanoid.js';
import { connection } from '../database.js';
import { serverError } from './controllersHelper.js';

const nanoid = customAlphabet(NANOID.CUSTOM_ALPHABET, NANOID.LENGTH);

async function insert(req, res) {
    const { userId, url } = res.locals;
    const shortUrl = nanoid();
    try {
        const urlInsertion = await connection.query(
            `INSERT INTO ${TABLES.URLS} (${URLS.URL}) VALUES ($1) ON CONFLICT DO NOTHING;`,
        [url]);
        const shortUrlInsertion = (await connection.query(
            `INSERT INTO "${TABLES.SHORT_URLS}" ("${SHORT_URLS.SHORT_URL}", "${SHORT_URLS.USER_ID}", "${SHORT_URLS.URL_ID}")
            VALUES ('${shortUrl}', ${userId},
                (SELECT ${URLS.ID} FROM ${TABLES.URLS} WHERE ${URLS.URL} = $1)
            );`,
        [url])).rowCount;
        
        if(shortUrlInsertion === 0){
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }

        res.status(STATUS_CODE.CREATED).send({ shortUrl });
    } catch (error) {
        serverError(res, error);
    }
}

async function list(req, res) {
    const id = Number(req.params.id);
    if(!Number.isInteger(id)) {
        return res.sendStatus(STATUS_CODE.NOT_FOUND);
    }

    try {
        const selection = (await connection.query(
            `SELECT
                "${TABLES.SHORT_URLS}".${SHORT_URLS.ID},
                "${TABLES.SHORT_URLS}"."${SHORT_URLS.SHORT_URL}",
                ${TABLES.URLS}.${URLS.URL}
            FROM "${TABLES.SHORT_URLS}"
                JOIN ${TABLES.URLS}
                ON "${TABLES.SHORT_URLS}"."${SHORT_URLS.URL_ID}" = ${TABLES.URLS}.${URLS.ID}
            WHERE "${TABLES.SHORT_URLS}".${SHORT_URLS.ID} = $1;`,
        [id])).rows[0];
        
        if(!selection) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }

        res.status(STATUS_CODE.OK).send(selection);
    } catch (error) {
        serverError(res, error);
    }
}

async function open(req, res) {
    const { shortUrl } = req.params;
    try {
        const selection = (await connection.query(
            `SELECT
                "${TABLES.SHORT_URLS}".${SHORT_URLS.ID} AS "${VISITS.SHORT_URL_ID}",
                ${TABLES.URLS}.${URLS.URL}
            FROM "${TABLES.SHORT_URLS}"
                JOIN ${TABLES.URLS}
                ON "${TABLES.SHORT_URLS}"."${SHORT_URLS.URL_ID}" = ${TABLES.URLS}.${URLS.ID} 
            WHERE "${TABLES.SHORT_URLS}"."${SHORT_URLS.SHORT_URL}" = $1;`,
        [shortUrl])).rows[0];
        
        if(!selection) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }

        const insertion = (await connection.query(
            `INSERT INTO ${TABLES.VISITS} ("${VISITS.SHORT_URL_ID}")
            VALUES (${selection.shortUrlId});`
        )).rowCount;

        if(insertion === 0) {
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }

        res.redirect(selection.url);
    } catch (error) {
        serverError(res, error);
    }
}

async function remove(req, res) {
    const { shortUrlId } = res.locals;
    try {
        const visitsRemoval = await connection.query(
            `DELETE FROM ${TABLES.VISITS} WHERE ${VISITS.SHORT_URL_ID} = $1;`,
        [shortUrlId]);

        const shortUrlRemoval = (await connection.query(
            `DELETE FROM "${TABLES.SHORT_URLS}" WHERE ${SHORT_URLS.ID} = $1;`,
        [shortUrlId])).rowCount;

        if(shortUrlRemoval !== 1) {
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }

        res.sendStatus(STATUS_CODE.NO_CONTENT);
    } catch (error) {
        serverError(res, error);
    }
}

export {
    insert,
    list,
    open,
    remove
};
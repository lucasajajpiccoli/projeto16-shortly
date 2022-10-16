import { customAlphabet } from 'nanoid';

import {
    TABLES,
    URLS,
    SHORT_URLS
} from '../enums/tables.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import { NANOID } from '../enums/nanoid.js';
import { connection } from '../database.js';
import { serverError } from './controllersHelper.js';

const nanoid = customAlphabet(NANOID.CUSTOM_ALPHABET, NANOID.LENGTH);

async function insert(req, res) {
    const { userId, url } = res.locals;
    const shortUrl = nanoid();
    console.log(userId);
    try {
        const urlInsertion = await connection.query(
            `INSERT INTO ${TABLES.URLS} (${URLS.URL}) VALUES ($1) ON CONFLICT DO NOTHING;`,
        [url]);
        const shortUrlInsertion = (await connection.query(
            `INSERT INTO "${TABLES.SHORT_URLS}" ("${SHORT_URLS.SHORT_URL}", "${SHORT_URLS.USER_ID}", "${SHORT_URLS.URL_ID}")
            VALUES ('${shortUrl}', ${userId},
            (SELECT ${URLS.ID} FROM ${TABLES.URLS} WHERE ${URLS.URL} = $1));`,
        [url])).rowCount;
        
        if(shortUrlInsertion === 0){
            return res.sendStatus(STATUS_CODE.SERVER_ERROR);
        }

        res.status(STATUS_CODE.CREATED).send({ shortUrl });
    } catch (error) {
        serverError(res, error);
    }
}

export {
    insert
};
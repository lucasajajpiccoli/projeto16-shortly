import { STATUS_CODE } from '../enums/statusCode.js';

function serverError(res, error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
}

export {
    serverError
};
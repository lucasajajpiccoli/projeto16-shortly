const TABLES = Object.freeze({
    USERS: "users",
    URLS: "urls",
    SESSIONS: "sessions",
    SHORT_URLS: "shortUrls",
    VISITS: "visits"
});

const USERS = Object.freeze({
    ID: "id",
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
    CREATED_AT: "createdAt"
});

const URLS = Object.freeze({
    ID: "id",
    URL: "url",
    CREATED_AT: "createdAt"
});

const SESSIONS = Object.freeze({
    ID: "id",
    USER_ID: "userId",
    TOKEN: "token",
    CREATED_AT: "createdAt"
});

const SHORT_URLS = Object.freeze({
    ID: "id",
    SHORT_URL: "shortUrl",
    USER_ID: "userId",
    URL_ID: "urlId",
    CREATED_AT: "createdAt"
});

const VISITS = Object.freeze({
    ID: "id",
    SHORT_URL_ID: "shortUrlId",
    CREATED_AT: "createdAt"
});

export {
    TABLES,
    USERS,
    URLS,
    SESSIONS,
    SHORT_URLS,
    VISITS
};
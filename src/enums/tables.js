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
    PASSWORD: "password"
});

const URLS = Object.freeze({
    ID: "id",
    URL: "url"
});

const SESSIONS = Object.freeze({
    ID: "id",
    USER_ID: "userId",
    TOKEN: "token"
});

const SHORT_URLS = Object.freeze({
    ID: "id",
    SHORT_URL: "shotUrl",
    USER_ID: "userId",
    URL_ID: "urlId"
});

const VISITS = Object.freeze({
    ID: "id",
    SHORT_URL_ID: "shortUrlId"
});

export {
    TABLES,
    USERS,
    URLS,
    SESSIONS,
    SHORT_URLS,
    VISITS
};
require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    DB_AUTH_URL: process.env.DB_AUTH_URL,
    PAGINATION_LIMIT: 10,
    SERVERERROR: 500,
    FAILURE: 400,
    UNAUTHORIZED: 401,
    UNVERIFIED_STATUS: 4,
    SUCCESS: 200,
    ACTIVE_STATUS: 1,
    INACTIVE_STATUS: 2,
    DELETED_STATUS: 3,
}

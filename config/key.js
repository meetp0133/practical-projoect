require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    DB_AUTH_URL: process.env.DB_AUTH_URL,
    SERVERERROR: 500,
    FAILURE: 400,
    SUCCESS: 200,
    ACTIVE_STATUS: 1,
    INACTIVE_STATUS: 2,
    DELETED_STATUS: 3,
}

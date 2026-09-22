const axios = require("axios");

const API_URL =
    process.env.GITCLONE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
});

module.exports = api;
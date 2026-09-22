const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mainRouter = require("./routes/main.route.js");
const path = require("path");

const { Server } = require("socket.io");

dotenv.config({
    path: path.join(__dirname, ".env")
});

function startServer() {

    const app = express();

    const port = process.env.PORT || 3000;

    app.use(
        express.json({
            limit: "50mb"
        })
    );

    mongoose.connect(
        process.env.MONGODB_URI
    )
    .then(() => {

        console.log(
            "Successfully connected to mongo"
        );

    })
    .catch((err) => {

        console.error(
            "Error in mongo connection:",
            err
        );

    });

    app.use(
        cors({
            origin: "*"
        })
    );

    app.use(
        "/",
        mainRouter
    );

    const httpServer =
        http.createServer(app);

    const io =
        new Server(
            httpServer,
            {
                cors: {
                    origin: "*",
                    methods: [
                        "GET",
                        "POST"
                    ]
                }
            }
        );

    io.on(
        "connection",
        (socket) => {

            socket.on(
                "joinRoom",
                (userID) => {

                    socket.join(userID);

                }
            );

        }
    );

    httpServer.listen(
        port,
        () => {

            console.log(
                `Server is listening on port ${port}`
            );

        }
    );
}

startServer();
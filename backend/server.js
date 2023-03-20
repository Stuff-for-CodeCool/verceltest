require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { join } = require("path");

const entryRoutes = require("./routes/entries.routes");

const PORT = process.env.PORT;

express()
    .use(cors())
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use(express.static(join(__dirname + "/../frontend/dist/")))
    .get("/", (req, res) => {
        res.sendFile(join(__dirname + "/../frontend/dist/index.html"));
    })
    .use("/api/entries/", entryRoutes)
    .listen(PORT, () => console.log(`http://localhost:${PORT}/`));

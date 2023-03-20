require("dotenv").config();

const { Router } = require("express");
const { connect } = require("mongoose");
const Entries = require("../database/entry.model");

module.exports = Router()
    .use("/", (req, res, next) => {
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
        next();
    })
    .get("/populate", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        await Entries.deleteMany({});

        const dataToBeAdded = Array(20)
            .fill(0)
            .map((_, i) => ({ text: `This is the text for entry ${i + 1}` }));

        await Entries.insertMany(dataToBeAdded);
        await connection.disconnect();
        res.json({ message: "ok" });
    })
    .get("/", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        const entries = await Entries.find({}).sort({ updatedAt: -1 });
        await connection.disconnect();
        res.json(entries);
    })
    .post("/", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        res.json(await Entries.create({ text: req.body.text }));
        res.json(await Entries.create({ text: req.body.text }));
        await connection.disconnect();
    })
    .get("/:id", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        const entries = await Entries.findById(req.params.id);
        await connection.disconnect();
        res.json(entries);
    })
    .put("/:id", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        const updated = await Entries.findOneAndUpdate(
            { _id: req.params.id },
            { text: req.body.text, updatedAt: Date.now() }
        );
        await connection.disconnect();
        res.json(updated);
    })
    .delete("/:id", async (req, res) => {
        const connection = await connect(process.env.MONGO_URL);
        const { id } = req.params;
        const deleted = await Entries.deleteOne({ _id: id });
        await connection.disconnect();

        if (deleted.deletedCount > 0) {
            res.json({ message: `Deleted entry ${id}` });
        } else {
            res.json({ error: `Cound not delete entry ${id}` });
        }
    });

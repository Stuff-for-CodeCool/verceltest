require("dotenv").config();

const { Router } = require("express");
const { connect } = require("mongoose");
const Entries = require("../database/entry.model");

const connection = connect(process.env.MONGO_URL);

module.exports = Router()
    .get("/populate", async (req, res) => {
        await Entries.deleteMany({});

        const dataToBeAdded = Array(20)
            .fill(0)
            .map((_, i) => ({ text: `This is the text for entry ${i + 1}` }));

        await Entries.insertMany(dataToBeAdded);
        res.json({ message: "ok" });
    })
    .get("/", async (req, res) => {
        res.json(await Entries.find({}).sort({ updatedAt: -1 }));
    })
    .post("/", async (req, res) => {
        res.json(await Entries.create({ text: req.body.text }));
    })
    .get("/:id", async (req, res) => {
        res.json(await Entries.findById(req.params.id));
    })
    .put("/:id", async (req, res) => {
        res.json(
            await Entries.findOneAndUpdate(
                { _id: req.params.id },
                { text: req.body.text, updatedAt: Date.now() }
            )
        );
    })
    .delete("/:id", async (req, res) => {
        const { id } = req.params;
        const deleted = await Entries.deleteOne({ _id: id });

        if (deleted.deletedCount > 0) {
            res.json({ message: `Deleted entry ${id}` });
        } else {
            res.json({ error: `Cound not delete entry ${id}` });
        }
    });

const { Schema, model } = require("mongoose");

module.exports = model(
    "Entry",
    new Schema({
        text: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
    })
);

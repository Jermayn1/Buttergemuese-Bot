const { Schema, model } = require("mongoose");

module.exports = model("valoChannel", new Schema({
    Guild: String,
    Channel: String
}));

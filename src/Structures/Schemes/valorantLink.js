const { Schema, model } = require("mongoose");

module.exports = model("valorantLink", new Schema({
    // Discord
    Guild: String,
    User: String,
    // Valo
    PUUID: String,
    Region: String,
    LastMatchId: String
}));

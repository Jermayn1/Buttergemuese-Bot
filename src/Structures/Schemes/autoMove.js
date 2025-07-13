const { model, Schema } = require("mongoose");

module.exports = model("autoMove", new Schema({
    Guild: String,
    User: String,
    Enabled: Boolean
}));
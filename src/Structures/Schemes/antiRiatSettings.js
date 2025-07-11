const { model, Schema } = require("mongoose");

module.exports = model("antiRiatSettings", new Schema({
    Guild: String,
    Enabled: Boolean
}));
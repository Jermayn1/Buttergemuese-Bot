const { Events, Client } = require("discord.js");

module.exports = {
    name: "raw",
    once: false,
    async execute(packet, client) {
        client.manager.packetUpdate(packet);
    }
}
const { Events, Client } = require("discord.js");

module.exports = {
    name: Events.Raw,
    once: false,
    /**
     * @param {raw} member 
     * @param {Client} client 
     */
    async execute(packet, client) {
        client.manager.packetUpdate(packet);
    }
}
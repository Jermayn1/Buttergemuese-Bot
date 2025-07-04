const { Client } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Client logged in as ${client.user.tag}`);

        // Setzt den Discord Status
        client.user.setPresence({
            activities: [{ name: "Woof Woof!" }]
        });

        // Riat Role Feature
        const { giveRiatRole } = require("../../Structures/Functions/riatFeature");
        giveRiatRole(client);
    }
}
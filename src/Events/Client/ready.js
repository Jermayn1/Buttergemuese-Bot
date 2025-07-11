const { Client } = require("discord.js");

// Importiert die loadHandler Funktionen
const { loadCommands } = require("../../Structures/Handlers/commandHandler");
const { loadButtons } = require("../../Structures/Handlers/buttonHandler");

// Importiert MongoDB
const { connect } = require("mongoose");

// Kopiert die DB Settings für das Sicherheitssystem
const antiRiatSettings = require("../../Structures/Schemes/antiRiatSettings");


module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Client logged in as ${client.user.tag}`);

        // Verbindet sich mit der Datenbank
        await connect(process.env.DB_URL, {})
        .then(() => console.log("The Client is now connected to the database"));

        // Setzt den Discord Status
        client.user.setPresence({
            activities: [{ name: "Woof Woof!!!" }]
        });

        // Läd alle weiteren Handler (Command, Buttons, etc.)
        await loadCommands(client);
        await loadButtons(client);

        // Läd die Anti Riat Settings in die Collection
        try {
            let data = await antiRiatSettings.findOne({ Guild: "596787251959037965" });
            client.sicherheit.set(data.Guild, { enabled: data.Enabled})
        } catch(e) { }

        // Riat Role Feature
        const { giveRiatRole } = require("../../Structures/Systems/Sicherheit/antiRiatSystem");
        giveRiatRole(client);
    }
}
const { Client } = require("discord.js");

// Importiert die loadHandler Funktionen
const { loadCommands } = require("../../Structures/Handlers/commandHandler");
const { loadButtons } = require("../../Structures/Handlers/buttonHandler");

// Importiert MongoDB
const { connect } = require("mongoose");

// 24/7 Voice
const voice = require("../../Structures/Systems/AlwaysInVoice/voiceUtil");


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

        // Moonlink Manager initalisierung erster Start
        client.manager.init(client.user.id)
        .then(() => console.log("Der Moonlight (Musik) Manager wurde initalisiert!"));
        
        const guild = client.guilds.cache.get("596787251959037965");
        const channel = guild.channels.cache.get("1316355798561062964");

        if (guild && channel) {
            await voice.joinAndStay(channel);
        }

        // Läd alle weiteren Handler (Command, Buttons, etc.)
        await loadCommands(client);
        await loadButtons(client);
    }
}
const { 
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    AttachmentBuilder
} = require("discord.js");

const fs = require("fs");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("aivideo")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription("Erstellt ein Neuroreel AI Video")
        .addStringOption(option =>
            option.setName("thema")
                .setDescription("Thema des Videos")
                .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const topic = interaction.options.getString("thema");

        // Discord wartet sonst nur 3 Sekunden
        await interaction.deferReply();

        try {

            // 1️⃣ API starten
            const response = await fetch("http://127.0.0.1:3000/api/pipeline/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ topic })
            });

            if (!response.ok) {
                return interaction.editReply("❌ API Fehler beim Starten der Pipeline.");
            }

            const data = await response.json();

            if (!data.success) {
                return interaction.editReply("❌ Video konnte nicht erstellt werden.");
            }

            const videoPath = data.videoFile; // z.B. /tmp/final_123.mp4

            // 2️⃣ Prüfen ob Datei existiert
            if (!fs.existsSync(videoPath)) {
                return interaction.editReply("❌ Video-Datei wurde nicht gefunden.");
            }

            // 3️⃣ Datei direkt hochladen (kein HTTP!)
            const attachment = new AttachmentBuilder(videoPath);

            await interaction.editReply({
                content: `✅ Video für **${topic}** wurde erstellt!`,
                files: [attachment]
            });

            // 4️⃣ Optional: Datei danach löschen (empfohlen bei /tmp)
            setTimeout(() => {
                fs.unlink(videoPath, () => {});
            }, 15000);

        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Ein unerwarteter Fehler ist aufgetreten.");
        }
    }
};
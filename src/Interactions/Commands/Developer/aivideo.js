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

    async execute(interaction, client) {

        if (client.videoProcessing) {
            return interaction.reply({
                content: "⏳ Es läuft bereits ein Render-Prozess.",
                ephemeral: true
            });
        }

        client.videoProcessing = true;

        const topic = interaction.options.getString("thema");

        // ✅ Sofort antworten (keine deferReply!)
        await interaction.reply({
            content: `🎬 Dein Video für **${topic}** wird erstellt...\n⏳ Das kann mehrere Minuten dauern.`,
            ephemeral: false
        });

        try {

            const response = await fetch("http://127.0.0.1:3000/api/pipeline/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic })
            });

            const data = await response.json();

            if (!data.success) {
                client.videoProcessing = false;
                return interaction.channel.send("❌ Fehler bei der Video-Erstellung.");
            }

            const videoPath = data.videoFile;

            if (!fs.existsSync(videoPath)) {
                client.videoProcessing = false;
                return interaction.channel.send("❌ Video-Datei nicht gefunden.");
            }

            const attachment = new AttachmentBuilder(videoPath);

            // ✅ Normale Nachricht nach Fertigstellung
            await interaction.channel.send({
                content: `✅ Video für **${topic}** ist fertig!`,
                files: [attachment]
            });

            setTimeout(() => {
                fs.unlink(videoPath, () => {});
            }, 15000);

        } catch (err) {
            console.error(err);
            await interaction.channel.send("❌ Unerwarteter Fehler beim Rendern.");
        }

        client.videoProcessing = false;
    }
};
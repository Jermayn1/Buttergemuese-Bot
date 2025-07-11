// Importiert das Scheme
const antiRiatSettings = require("../../../Structures/Schemes/antiRiatSettings");

const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
module.exports = {
    data:  new SlashCommandBuilder()
    .setName("antimelina")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Aktiviert/Deaktiviert das Anti-Riat System für Melina"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        // Prüft, ob es ein Eintrag gibt
        let data = await antiRiatSettings.findOne({
            Guild: interaction.guild.id
        });

        // Falls es noch kein DB Eintrag gibt
        if (!data) return data = await antiRiatSettings.create({
            Guild: interaction.guild.id,
            Enabled: true
        });
        // Toggelt von true auf false und umgekehrt
        else await data.updateOne({ "$set": { "Enabled": data.Enabled ? false : true }});

        const embed = new EmbedBuilder()
        .setColor(client.config.color.normal)
        .setDescription(`Das Anti-Riat System wurde ${data.Enabled ? "deaktiviert" : "aktiviert"}!`);

        try {
            client.sicherheit.set(data.Guild, { enabled: data.Enabled ? false : true})
        } catch(e) {
            console.log(e)
        }

        interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral]
        });
    }
}
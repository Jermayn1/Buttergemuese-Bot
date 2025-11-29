const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ActivityType } = require("discord.js");
const { getEmojis } = require("../../../Structures/Systems/Valorant/valorantStyle");
const { Status } = require("discord.js");

module.exports = {
    developer: true,
    data:  new SlashCommandBuilder()
    .setName("rsdwlcmsg")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Sendet alle Willkommen's Nachricht erneut in den Channel."),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.reply({ content: "Sende Willkommensnachrichten erneut …", ephemeral: true });

        await interaction.guild.members.fetch();

        // Alle Mitglieder der Guild abrufen
        const members = interaction.guild.members.cache;

        // Mitglieder sortieren nach Join-Datum (älteste zuerst)
        const sortedMembers = members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

        for (const member of sortedMembers.values()) {
            client.emit("guildMemberAdd", member);

            await wait(15000);
        }

        try {
            interaction.editReply({
                content: `✅ Fertig! Das Event **guildMemberAdd** wurde für **${count} Mitglieder** ausgelöst.`
            })
        } catch(err) {

        }
    }
}

// Delay
const wait = ms => new Promise(res => setTimeout(res, ms));
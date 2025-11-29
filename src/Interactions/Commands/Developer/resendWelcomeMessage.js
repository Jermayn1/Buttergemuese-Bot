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

        const guild = interaction.guild;

        await guild.members.fetch();

        const membersSorted = [...guild.members.cache.values()]
            .sort((a, b) => a.joinedAt - b.joinedAt)

        const total = membersSorted.length;
        let count = 0;

        for (const member of membersSorted) {

            client.emit("guildMemberAdd", member);
            count++;

            client.user.setPresence({
                activities: [
                    {
                        name: `${count} / ${total}`,
                        type: ActivityType.Watching
                    }
                ],
                status: "online"
            });

            await wait(5000);
        }

        try {
            client.user.setPresence({
                activities: [{
                    name: "Buttergemüse",
                    type: ActivityType.Watching
                }],
                status: "online"
            });

            interaction.editReply({
                content: `✅ Fertig! Das Event **guildMemberAdd** wurde für **${count} Mitglieder** ausgelöst.`
            })
        } catch(err) {

        }
    }
}

// Delay
const wait = ms => new Promise(res => setTimeout(res, ms));
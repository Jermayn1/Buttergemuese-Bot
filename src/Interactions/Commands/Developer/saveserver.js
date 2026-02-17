const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("fixssh")
        .setDescription("Aktiviert SSH & setzt sichere Firewall-Regeln")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.reply({
            content: "🛠️ Repariere SSH & Firewall...",
            flags: [MessageFlags.Ephemeral]
        });

        const commands = [
            "sudo systemctl enable ssh",
            "sudo systemctl start ssh",
            "sudo ufw allow 22/tcp",
            "sudo ufw --force enable",
            "sudo systemctl status ssh --no-pager",
            "sudo ufw status"
        ];

        exec(commands.join(" && "), (error, stdout, stderr) => {

            if (error) {
                return interaction.followUp({
                    content: `❌ Fehler:\n\`\`\`${stderr}\`\`\``,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            interaction.followUp({
                content: `✅ Fertig!\n\`\`\`${stdout}\`\`\``,
                flags: [MessageFlags.Ephemeral]
            });

        });
    }
}

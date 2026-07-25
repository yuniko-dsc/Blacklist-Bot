const { Client, Interaction } = require('discord.js')

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {Interaction} interaction 
    */
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            const isOwner = (client.config.owners || []).includes(interaction.user.id);
            const isBuyer = client.config.buyer && client.config.buyer === interaction.user.id;
            const isAdmin = isOwner || isBuyer;

            if (command.botBuyerOnly && !isBuyer) {
                return interaction.reply({
                    content: `❌ **Vous devez être l'acheteur du bot pour exécuter cette commande.**`,
                    ephemeral: true
                });
            };

            if (command.botOwnerOnly && !isAdmin) {
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du bot pour exécuter cette commande.**`,
                    ephemeral: true
                });
            };

            if (command.guildOwnerOnly && interaction.member.guild.ownerId != interaction.user.id && !isAdmin) {
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`,
                    ephemeral: true
                });
            };

            if (command.permissions?.length) {
                const authorPerms = interaction.channel.permissionsFor(interaction.user) || interaction.member.permissions;
                if (!authorPerms.has(command.permissions) && !isAdmin) {
                    return interaction.reply({
                        content: `❌ **Vous n'avez pas les permissions nécessaires pour exécuter cette commande.**`,
                        ephemeral: true
                    });
                }
            };

            command.executeSlash(client, interaction);
            console.log("[CMD-S]", interaction.guild ? `${interaction.guild.name} | ${interaction.channel.name}` : `DM`, `| ${interaction.user.username} | ${command.name}`);
        };
    }
}
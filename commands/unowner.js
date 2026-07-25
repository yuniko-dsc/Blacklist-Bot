const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction } = require("discord.js");

module.exports = {
    name: "unowner",
    description: "Retire un owner du bot.",
    usage: "<user>",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botBuyerOnly: true,
    hide: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    async execute(client, message, args) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);

        if (!user) return message.channel.send(`Aucun utilisateur trouvé pour \`${args[0] ?? 'rien'}\``);
        if (!(client.config.owners || []).includes(user.id)) return message.channel.send(`${user.displayName} n'est pas owner`);

        client.config.owners = (client.config.owners || []).filter(id => id !== user.id);
        client.saveConfig();

        message.channel.send(`${user.displayName} n'est plus owner`);
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser("user");

        if (!(client.config.owners || []).includes(user.id))
            return interaction.reply({ content: `${user.displayName} n'est pas owner`, ephemeral: true });

        client.config.owners = (client.config.owners || []).filter(id => id !== user.id);
        client.saveConfig();

        interaction.reply({ content: `${user.displayName} n'est plus owner`, ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(option =>
                option.setName("user")
                    .setDescription("Utilisateur à retirer des owners")
                    .setRequired(true)
            );
    }
};

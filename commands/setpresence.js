const { SlashCommandBuilder, Client, Message, Interaction, PermissionsBitField } = require("discord.js");

const presenceEmojis = {
    online: "🟢",
    idle: "🟡",
    dnd: "🔴",
    invisible: "⚫"
};

module.exports = {
    name: "setpresence",
    description: "Modifie la présence du bot.",
    usage: "<online|idle|dnd|invisible>",
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
        const presence = (args || "").trim().toLowerCase();
        if (!Object.keys(presenceEmojis).includes(presence)) {
            return message.reply("Veuillez fournir une présence valide : `online`, `idle`, `dnd` ou `invisible`");
        }

        client.user.setPresence({ status: presence });
        client.config.presence = { ...(client.config.presence || {}), status: presence };
        client.saveConfig();

        message.reply(`La présence a été modifiée : \`${presenceEmojis[presence]} ${presence}\``);
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction) {
        const presence = interaction.options.getString("presence");

        client.user.setPresence({ status: presence });
        client.config.presence = { ...(client.config.presence || {}), status: presence };
        client.saveConfig();

        interaction.reply({ content: `La présence a été modifiée : \`${presenceEmojis[presence]} ${presence}\``, ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName("presence")
                    .setDescription("Nouvelle présence")
                    .setRequired(true)
                    .addChoices(
                        { name: "🟢 Online", value: "online" },
                        { name: "🟡 Idle", value: "idle" },
                        { name: "🔴 Do Not Disturb", value: "dnd" },
                        { name: "⚫ Invisible", value: "invisible" }
                    )
            );
    }
};

const { SlashCommandBuilder, Client, Message, Interaction, ActivityType, PermissionsBitField } = require("discord.js");

const activityTypes = {
    playing: ActivityType.Playing,
    streaming: ActivityType.Streaming,
    watching: ActivityType.Watching,
    listening: ActivityType.Listening,
    competing: ActivityType.Competing
};

module.exports = {
    name: "setstatus",
    description: "Modifie le statut du bot.",
    usage: "<type> <texte>",
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
        const parts = (args || "").trim().split(/ +/);
        const type = parts[0]?.toLowerCase();
        const text = parts.slice(1).join(" ");

        if (!type || !text) {
            return message.reply(`Utilisation : ${client.config.prefix}setstatus <${Object.keys(activityTypes).join("/")}> <texte>`);
        }

        const activityType = activityTypes[type];
        if (!activityType) {
            return message.reply(`Type invalide. Types acceptés : \`${Object.keys(activityTypes).join(", ")}\``);
        }

        const activityOptions = { type: activityType };
        if (type === "streaming") activityOptions.url = "https://www.twitch.tv/002sans";

        client.user.setActivity(text, activityOptions);
        client.config.presence = {
            ...(client.config.presence || {}),
            activities: [{ name: text, type: activityType, ...(type === "streaming" ? { url: "https://www.twitch.tv/002sans" } : {}) }]
        };
        client.saveConfig();

        message.reply(`Le statut a été modifié : \`${type} ${text}\``);
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction) {
        const type = interaction.options.getString("type");
        const text = interaction.options.getString("texte");

        const activityType = activityTypes[type];
        const activityOptions = { type: activityType };
        if (type === "streaming") activityOptions.url = "https://www.twitch.tv/002sans";

        client.user.setActivity(text, activityOptions);
        client.config.presence = {
            ...(client.config.presence || {}),
            activities: [{ name: text, type: activityType, ...(type === "streaming" ? { url: "https://www.twitch.tv/002sans" } : {}) }]
        };
        client.saveConfig();

        interaction.reply({ content: `Le statut a été modifié : \`${type} ${text}\``, ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName("type")
                    .setDescription("Type d'activité")
                    .setRequired(true)
                    .addChoices(
                        { name: "Playing", value: "playing" },
                        { name: "Streaming", value: "streaming" },
                        { name: "Watching", value: "watching" },
                        { name: "Listening", value: "listening" },
                        { name: "Competing", value: "competing" }
                    )
            )
            .addStringOption(option =>
                option.setName("texte")
                    .setDescription("Texte du statut")
                    .setRequired(true)
            );
    }
};

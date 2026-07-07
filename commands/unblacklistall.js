const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "unblacklistall",
    description: "Unblacklist tous les utilisateurs blacklist.",
    aliases: ['unblall'],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message  
     * @param {string} args 
    */
    async execute(client, message, args) {
        const datas = Object.keys(client.db);
        client.db = {};
        client.saveDB();

        return message.channel.send(`**${datas.length}** utilisateurs ont ete unblacklist.`);
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const datas = Object.keys(client.db);
        client.db = {};
        client.saveDB();

        return interaction.reply({ content: `**${datas.length}** utilisateurs ont ete unblacklist.` });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}
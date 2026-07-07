const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction } = require("discord.js");

module.exports = {
    name: "help",
    description: "Afficher les commandes du bot.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    hide: true,
    /**
     * @param {Client} client
     * @param {Message} message  
     * @param {string} args 
    */
    async execute(client, message, args) {
        const embed = {
            title: `Blacklist`,
            color: 0xffffff,
            description: client.commands.filter(c => !c.hide).map(c => `**\`${client.config.prefix}${c.name}${c.usage ? ` ${c.usage}` : ''}\`** - ${c.description}`).join('\n'),
            footer: { text: `ζ͜͡${client.user.displayName} • Préfixe actuel : ${client.config.prefix}` }
        }

        return message.channel.send({ embeds: [embed] });
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
    */
    async executeSlash(client, interaction) {
        const embed = {
            title: `Blacklist`,
            color: 0xffffff,
            description: client.commands.filter(c => !c.hide).map(c => `**\`${client.config.prefix}${c.name}${c.usage ? ` ${c.usage}` : ''}\`** - ${c.description}`).join('\n'),
            footer: { text: `ζ͜͡${client.user.displayName} • Préfixe actuel : /` }
        }    

        interaction.reply({ embeds: [embed] });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }
}
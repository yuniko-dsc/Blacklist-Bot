const { ActivityType, Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");

if (!fs.existsSync('./db.json'))
    fs.writeFileSync('./db.json', '{}', 'utf-8');

const config = require("./config.json");

const client = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: [ Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User ],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: config.presence,
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});


client.config = config;
client.db = require('./db.json');
client.saveDB = () => fs.writeFileSync('./db.json', JSON.stringify(client.db, null, 4));
client.saveConfig = () => fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 4));

client.login(client.config.token);

// chargement des events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    };
};

// chargement des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};

// gestion des erreurs
async function errorHandler(error) {
    // erreurs ignorées
    if (error.code == 10062) return; // Unknown interaction
    if (error.code == 40060) return; // Interaction has already been acknowledged

    console.log(`[ERROR] ${error}`);
    console.log(error)
};

process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);

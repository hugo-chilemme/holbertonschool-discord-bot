const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = require('../core/discord.json');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
const { Routes } = require('discord-api-types/v9');

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
];

const client = new Client({ intents });

client.login(DISCORD_TOKEN);
client.on('ready', () => {
    console.log('Authenticated');
    
    require('../lib/functs/translate')(client);
    require('../lib/functs/ai')(client);
});



const sendMessage = async (channelId, content = {}) => {
    const channel = await client.channels.fetch(channelId);
    await channel.send(content);
};

const commands = [
    {
        name: 'Translate in English',
        type: 3,
        default_permission: false,
        name_localizations: {
            "fr": "Traduire en Anglais",
        },
    },
    {
        name: 'Ask Bing AI',
        type: 3,
        default_permission: false,
        name_localizations: {
            "fr": "Demander à Bing AI",
        },
    },
    {
        name: 'Ask SFT-4',
        type: 3,
        default_permission: false,
        name_localizations: {
            "fr": "Demander à SFT-4",
        },
    }
];


(async () => {
    try {
        console.log('Started refreshing application commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application commands.');
    } catch (error) {
        console.error(error);
    }
})();


exports.sendMessage = sendMessage;

const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN } = require('../core/discord.json');

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
});

require('../lib/functs/translate')(client);

const sendMessage = async (channelId, content = {}) => {
    const channel = await client.channels.fetch(channelId);
    await channel.send(content);
};

exports.sendMessage = sendMessage;

const {
	Client,
	GatewayIntentBits, 
} = require('discord.js');

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
const client = new Client({intents});
client.login("MTA0NTc4NjQzODQ3MTUzMjYzNA.G1Oc19.eN25TO8GsBgYl2IzRNvXxfnYg0s8QP9a6gxTP0");
client.on("ready", () =>  console.log('authentified'));

const sendMessage = async (channelId, content = {}) => {
    const channel = await client.channels.fetch(channelId);
    await channel.send(content);
}

exports.sendMessage = sendMessage;
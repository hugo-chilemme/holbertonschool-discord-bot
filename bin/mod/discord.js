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
const client = new Client({intents});

client.login(DISCORD_TOKEN);
client.on("ready", () => console.log('authentified'));
client.on('message', async (message) => {
	if (message.content === '!createEvent') {
	  // Enregistrement de la commande personnalisée
	  const commandData = {
		name: 'createevent',
		description: 'Créer un événement planifié',
		options: [
		  {
			name: 'titre',
			description: 'Le titre de l\'événement',
			type: 3, // 3 pour String
			required: true
		  },
		  {
			name: 'date',
			description: 'La date de l\'événement',
			type: 4, // 4 pour String avec type DATE
			required: true
		  }
		]
	  };
  
	  const guildId = message.guild.id;
	  const endpoint = `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guildId}/commands`;
  
	  try {
		const response = await fetch(endpoint, {
		  method: 'POST',
		  body: JSON.stringify(commandData),
		  headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bot ${token}`
		  }
		});
  
		const data = await response.json();
		console.log('Command registered:', data);
		message.reply('Commande de création d\'événement enregistrée avec succès!');
	  } catch (error) {
		console.error('Error registering command:', error);
		message.reply('Une erreur est survenue lors de l\'enregistrement de la commande.');
	  }
	}
  });
const sendMessage = async (channelId, content = {}) => {
    const channel = await client.channels.fetch(channelId);
    await channel.send(content);
}

exports.sendMessage = sendMessage;
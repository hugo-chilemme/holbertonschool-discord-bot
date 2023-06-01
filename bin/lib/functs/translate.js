const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = require('../../core/discord.json');
const translate = require('translate-google')
const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

const commands = [
    {
        name: 'Translate in English',
        type: 3,
        default_permission: false,
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


let cached = {};
const onconnect = (client) => {


    client.on('interactionCreate', async (interaction) => {

        if (interaction.commandName !== "Translate in English") {
            return;
        }

        const m = interaction.options.get('message');
        if (!cached[interaction.targetId]) {
            const res = await translate(m.message.content, {to: 'en'});
            cached[interaction.targetId] = res;
        }

        interaction.reply({ephemeral: true, content: cached[interaction.targetId]});

    });
}

module.exports = onconnect;
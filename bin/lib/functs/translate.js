const translate = require('translate-google')


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
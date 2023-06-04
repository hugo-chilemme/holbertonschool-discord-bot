const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { inputEngine } = require('./ai');


const store = require('data-store')({ path: process.cwd() + '/bin/core/modal.json' });
const storeSlack = require('data-store')({ path: process.cwd() + '/bin/core/slack.json' });


const Users = storeSlack.get('users') || {};


const SelectorMenu = () => {
    const select = new StringSelectMenuBuilder()
    .setCustomId('conversations-model')
    .setPlaceholder('Select intelligence model')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Bing-AI')
            .setDescription('Built on the power of ChatGPT 4 and Bing Search')
            .setValue('bing-ai'),
        new StringSelectMenuOptionBuilder()
            .setLabel('SFT-4')
            .setDescription('Based on speed and precision')
            .setValue('sft-4'),
    );

    const row = new ActionRowBuilder()
    .addComponents(select);

    return row;

}

const handleInteraction = async (interaction) => {
    if (interaction.customId !== "conversations-model") return;
    const response = interaction.values[0];

    const channelUuid = uuidv4().slice(0, 8);
    const channelName = response.replaceAll('-', '') + "-" + channelUuid;

    const guild = await interaction.guild.fetch('976357520895528960');

    const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: "1114613280934219876",
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
        ]
    });

    const Sessions = localModal.get('sessions') || {};

    Sessions[channel.id] = {
        modal: response,
        uuid: channelUuid,
        author: interaction.user,
        version: 1,
        messages: [],
    }
    localModal.set('sessions', Sessions);

    const prompt = `Hello my name is ${interaction.member.nickname || interaction.user.username} :)`;

    await interaction.message.edit({components: [SelectorMenu()], content: `You can now test all the new AI features on the market (they will be updated over time) by selecting a model you will be redirected to a private conversation.`})

    interaction.reply({content: `You opened a conversation, click here <#${channel.id}>`, ephemeral: true})

    const bot_msg = await channel.send(`<@${interaction.user.id}> ?`);

    inputEngine(prompt, bot_msg, 'sft-4', channel.id);

    const logs = guild.channels.cache.get('1114961049737769011');
    
    logs.send(`<@${interaction.user.id}> opened conversation modal ${response} on \`${channelUuid}\`.`);
    
};


const onconnect = (client) => {
    try {
        // client.on('messageCreate', handleMessage);
        client.on('interactionCreate', handleInteraction);
    } catch(e) { console.error(e); }
}
module.exports = onconnect;
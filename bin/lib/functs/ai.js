const { exec } = require('child_process');
const allowedMessageChannels = ['1114275821549535323', '1113848668336951296'];
const store = require('data-store')({ path: process.cwd() + '/bin/core/modal.json' });
const ModalsList = store.get('modal');

let client_id;

const searchEngine = async (answer, cb, model) => {
    const command = `node ${process.cwd()}/bin/ext/${model}/index.js "${answer}"`;
    const child = exec(command);

    let content = "", intervalId;

    child.stdout.on('data', text => {
        content = decodeURIComponent(atob(text))
    });

    const CallbackToSource = () => {
        if (content) cb(content);
    }
    child.on('close', () => {
        clearInterval(intervalId);
        CallbackToSource()
    });
    
    intervalId = setInterval(() => CallbackToSource(), 500);
};

async function inputEngine (content, interaction, model) {
    if (!content || !interaction) return;
    searchEngine(content, progressContent => handleMessageReply(interaction, progressContent), model);
}

const handleMessageReply = async (response, content) => {
    if (response.editReply) return await response.editReply(content);
    if (response.edit && response.author.bot) return await response.edit(content);
    if (response.reply) return await response.reply(content);
}

const handleInteraction = (interaction) => {
    const Modal = interaction.commandName.split('Ask ')[1];
    if (!Modal || !ModalsList[Modal]) return;
    console.log(interaction);
    const messageContent = interaction.options.get('message').message.content;

    interaction.deferReply();
    inputEngine(messageContent, interaction, ModalsList[Modal]);
};

const handleMessage = async (message) => {
    if (!allowedMessageChannels.includes(message.channelId) || message.author.bot) return;
    const messageContent = message.content;
    const messageSearching = `Searching: ${messageContent}`;

    const replyMessage = await handleMessageReply(message, messageSearching);
    inputEngine(messageContent, replyMessage, 'bing-ai');
};

const onReadyClient = client => {
    client_id = client.user.id;
    client.on('interactionCreate', handleInteraction);
    client.on('messageCreate', handleMessage);
}
module.exports = onReadyClient;
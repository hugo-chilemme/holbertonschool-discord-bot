const { exec } = require('child_process');
const allowedMessageChannels = ['1114275821549535323'];
const store = require('data-store')({ path: process.cwd() + '/bin/core/modal.json' });
const ModalsList = store.get('modal');

let client_id;

const searchEngine = async (answer, uuid, cb, model) => {
    const Sessions = localModal.get('sessions') || {};
    const session = Sessions[uuid] || null;
    let config = "";
  
    if (session && session.config) {
      config = btoa(encodeURIComponent(JSON.stringify(session.config)));
    }
  
    const command = `node ${process.cwd()}/bin/ext/index.js ${model} "${answer}" "${config}"`;
  
    console.log(command);
  
    let content = "";
    let intervalId;
  
    const onData = (data) => {
      const j = JSON.parse(data);
  
      if (j.type === "conversation") {
        content = decodeURIComponent(atob(j.content));
      } else if (j.type === "config") {
        if (!session) return;
        Sessions[uuid].config = j.config;
        store.set('sessions', Sessions);
      }
    };
  
    const child = exec(command, (error, stdout, stderr) => {
      clearInterval(intervalId);
      if (error) {
        console.error(`Error executing command: ${error}`);
        return;
      }
      CallbackToSource();
    });
  
    child.stdout.on('data', onData);
  
    const CallbackToSource = () => {
      if (content) cb(content);
    };
  
    child.on('close', () => {
      CallbackToSource();
    });
  
    intervalId = setInterval(CallbackToSource, 500);
  };
  

async function inputEngine (content, interaction, model, conversationId = null) {
    if (!content || !interaction || !model) return;
    searchEngine(content, conversationId, progressContent => handleMessageReply(interaction, progressContent), model);
}

const handleMessageReply = async (response, content) => {
    if (response.editReply) return await response.editReply(content);
    if (response.edit && response.author.bot) return await response.edit(content);
    if (response.reply) return await response.reply(content);
}

const handleInteraction = (interaction) => {
    if(!interaction.commandName) return;
    const Modal = interaction.commandName.split('Ask ')[1];
    if (!Modal || !ModalsList[Modal]) return;
    const messageContent = interaction.options.get('message').message.content;

    interaction.deferReply();
    inputEngine(messageContent, interaction, ModalsList[Modal]);
};

const handleMessage = async (message) => {
    if (!message.channel.parentId || message.channel.parentId !== "1114613280934219876") return;
    if (message.author.bot) return;

    const Sessions = localModal.get('sessions') || {};
    const session = Sessions[message.channel.id];

    if (message.author.id !== session.author.id) return;
    if (!session || session.version !== 1) return await handleMessageReply(message, "Your conversation has expired, please restart one");

    const messageContent = message.content;
    const messageSearching = `Your request is in progress, estimated time is 4 seconds`;

    const replyMessage = await handleMessageReply(message, messageSearching);
    inputEngine(messageContent, replyMessage, session.modal, message.channel.id);
};

const init = client => {
    client_id = client.user.id;
    client.on('interactionCreate', handleInteraction);
    client.on('messageCreate', handleMessage);
}
exports.init = init;
exports.inputEngine = inputEngine;
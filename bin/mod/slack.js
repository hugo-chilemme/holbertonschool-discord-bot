const Webhook = require('../lib/webhook');
const { ANNOUNCEMENT_URI } = require('../core/discord.json');
const store = require('data-store')({ path: process.cwd() + '/bin/core/slack.json' });
const { slack } = require('../lib/slack');


const fetch = async () => {

    if ( store.get('expires_in') < new Date().getTime() )
    {
        await slack.api.oauth_refresh();
    }

    const WEBHOOK_URI = ANNOUNCEMENT_URI;   
    const messages = await slack.api.conversations_history('C043TN0J3RD', 100);
    const messages_history = store.get('message_id');


    
    let OnlineMessages = [];
    for (const m of messages) {
        OnlineMessages.push(m.client_msg_id);
    }

    let needDeleteEntries = [];
    for (const client_msg_id of Object.keys(messages_history)) {
        if (!OnlineMessages.includes(client_msg_id) && client_msg_id !== "undefined") {
            needDeleteEntries.push(client_msg_id);
        }
    }
    for (const client_msg_id of needDeleteEntries) {
        const m = messages_history[client_msg_id];
        if (!m) return;
        await Webhook.remove(m.webhook_id, m.message_id);
        delete messages_history[client_msg_id];
    };
    
       
    for (const m of messages)
    {
        const message_id = m.client_msg_id;

        if (!message_id) {
            continue;
        }

        let message = "";
        try {
            message = decodeURIComponent(m.text);
        } catch(e) { }

        message = message.replaceAll('<!here>', '@here').trim(); // use message of discord
        message = message.replaceAll('<!channel>', '@everyone').trim(); // use message of discord
        message = message.replaceAll('&gt;', ' ').trim(); // Delete 'space' before ul
        message = message.replaceAll('::', ': :').trim(); // Separate two emojies
        
        if (m.type !== "message") {
            continue;
        }
        
        if (messages_history[message_id]) {
            if (m.edited) {
                const msg = messages_history[message_id];
                const tts = m.edited.ts;

                if (msg.edited_at === "never" || tts != msg.edited_at) {
                    await Webhook.edit(msg.webhook_id, msg.message_id, {content: message});
                    msg.edited_at = tts;
                }
            
            }
            continue;
        }
        const user = await slack.api.users_profile_get(m.user);
        
        const messageDiscordId = await Webhook.send(WEBHOOK_URI, {
            username: user.display_name,
            avatar_url: user.image_original,
            content: message,
        });


        messages_history[message_id] = {
            webhook_id: WEBHOOK_URI,
            message_id: messageDiscordId,
            created_at: m.ts,
            edited_at: "never",
        }; 
    }

    store.set('message_id', messages_history);
}


exports.fetch = fetch;
const Webhook = require('../lib/webhook');
const { ANNOUNCEMENT_URI } = require('../core/discord.json');
const store = require('data-store')({ path: process.cwd() + '/bin/core/slack.json' });
const { slack } = require('../lib/slack');

const fetch = async () => {

    if ( store.get('expires_in') < new Date().getTime() )
    {
        await slack.api.oauth_refresh();
    }

    const messages = await slack.api.conversations_history('C043TN0J3RD', 1);
    const messages_history = store.get('message_id');
    
    for (const m of messages)
    {
        const message_id = m.client_msg_id;
        
        let message = decodeURIComponent(m.text);
        message = message.replaceAll('<!here>', '@here').trim();
        message = message.replaceAll('<!channel>', '@everyone').trim();
        message = message.replaceAll('&gt;', ' ').trim();
        
        if (m.type !== "message" || messages_history.includes(message_id)) {
            continue;
        }
        const user = await slack.api.users_profile_get(m.user);
           
        messages_history.push(message_id);
        store.set('message_id', messages_history);

        Webhook.send(ANNOUNCEMENT_URI, {
            username: user.display_name,
            avatar_url: user.image_original,
            content: message,
        })
    }

}


exports.fetch = fetch;
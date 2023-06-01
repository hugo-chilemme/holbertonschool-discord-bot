const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const store = require('data-store')({ path: process.cwd() + '/bin/core/slack.json' });
const slack = new Map();

slack.api = {};

slack.api.get = () => {

    let api = {
        client_id: "4071953744069.4235671570128",
        client_secret: "5e3a5a89b28af6c195084daa333bee92",
    }

    const Authorization = `Bearer ${store.get('access_token')}`;
    api.router = {
        oauth_refresh: {
            url: "https://slack.com/api/oauth.v2.access",
            params: {
                client_id: api.client_id,
                grant_type: "refresh_token",
                client_secret: api.client_secret,
                refresh_token: store.get('refresh_token'),
            }
        },
        conversations_history: {
            url: "https://slack.com/api/conversations.history",
            headers: { Authorization }
        },
        conversations_list: {
            url: "https://slack.com/api/conversations.list",
            headers: { Authorization }
        },
        conversations_members: {
            url: "https://slack.com/api/conversations.members",
            headers: { Authorization },
        },
        users_profile_get: {
            url: "https://slack.com/api/users.profile.get",
            headers: { Authorization },
        },
        emoji_list: {
            url: "https://slack.com/api/emoji.list",
            headers: { Authorization },
        }
    }
    return api;
}

slack.api.send_request = async (event_name, params) => {
    let detail = slack.api.get().router[event_name];
    if (!detail) return error(`${event_name} not found`);

    if (params) detail.params = params;
    const api_url = slack.generate_url(detail.url, detail.params);

    let options = {method: 'GET'};
    if (detail.headers) options.headers = detail.headers;
  
    const response = await fetch(api_url, options);
    const data = await response.json();
    if (!data.ok)
    {
        console.error(data)
        return null;
    }
    return data;
}

slack.generate_url = (url, params) => {
    return url + "?" + new URLSearchParams(params).toString();
}

slack.api.oauth_refresh = async () => {
    const data = await slack.api.send_request('oauth_refresh');

    // if (store.get('expires_in') > new Date().getTime()) return store.get('access_token');
    console.log(data);
    if (data.access_token && data.refresh_token)
    {
        store.set('access_token', data.access_token);
        store.set('refresh_token', data.refresh_token);
        store.set('expires_in', new Date().getTime() + (data.expires_in * 1000));
        return data.access_token;
    }

}
slack.api.conversations_list = async () => {
    const data = await slack.api.send_request('conversations_list');
    return data.channels;
}
slack.api.conversations_history = async (channel, limit = null) => {
    let params = {channel: channel}
    if (limit) params.limit = limit
    const data = await slack.api.send_request('conversations_history', params);
    return data.messages.filter(message => message.type === 'message');
}
slack.api.conversations_members = async (channel) => {
    const data = await slack.api.send_request('conversations_members', {channel: channel});
    return data.members;
}

slack.api.users_profile_get = async (user) => {
    const data = await slack.api.send_request('users_profile_get', {user});
    return data.profile;
}

exports.slack = slack
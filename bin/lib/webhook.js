const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const send = async (webhookUrl, payload = {}) => {
    const response = await fetch(`${webhookUrl}?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        const data = await response.json();
        return data.id;
    }
}

const edit = async (webhookUrl, messageId, payload = {}) => {
    const response = await fetch(`${webhookUrl}/messages/${messageId}?wait=true`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

const remove = async (webhookUrl, messageId, ) => {
    const response = await fetch(`${webhookUrl}/messages/${messageId}?wait=true`, {
        method: 'DELETE',
    });
    return response.ok;
};

exports.send = send;
exports.edit = edit;
exports.remove = remove;
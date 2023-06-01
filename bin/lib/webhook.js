const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.send = async (webhookUrl, payload = {}) => {
    await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.send = (webhookUrl, payload = {}) => {
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    .then(response => {
        if (response.ok) {
        console.log('Webhook sent successfully.');
        } else {
        console.error('Failed to send webhook:', response.status, response.statusText);
        }
    })
    .catch(error => {
        console.error('Error occurred while sending webhook:', error);
    });
}
const slack = require('./mod/slack');
const calendar = require('./mod/calendar');
global.localModal = require('data-store')({ path: process.cwd() + '/bin/core/modal.json' });

const fetch = async  () => {
    await slack.fetch()

    try {
        await calendar.fetch();
    }
    catch(e) {
        console.log(e)
    }

    setTimeout(fetch, 5000);
}
fetch();

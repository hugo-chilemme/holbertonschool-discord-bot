const slack = require('./mod/slack');
const calendar = require('./mod/calendar');

slack.fetch()
// calendar.fetch();


const process = async  () => {
    await slack.fetch()
    // await calendar.fetch();

    setTimeout(process, 5000);
}
// setInterval(slack.fetch, 5000);
// setInterval(calendar.fetch, 5000);



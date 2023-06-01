const slack = require('./mod/slack');
const calendar = require('./mod/calendar');


const process = async  () => {
    await slack.fetch()
    await calendar.fetch();

    setTimeout(process, 5000);
}
process();



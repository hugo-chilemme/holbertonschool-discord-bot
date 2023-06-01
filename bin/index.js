const slack = require('./mod/slack');
const calendar = require('./mod/calendar');

slack.fetch()
calendar.fetch();
setInterval(slack.fetch, 5000);
// setInterval(calendar.fetch, 5000);



const { google } = require('googleapis');

async function getUpcomingEvents(calendarId) {

    const auth = new google.auth.GoogleAuth({
        keyFile: process.cwd() + '/bin/core/googleapis.json',
        scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const cl = await auth.getClient();

    const calendar = google.calendar({ version: 'v3', auth: cl });

    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
        calendarId: calendarId,
        singleEvents: true,
        timeMin: now.toISOString(), 
        timeMax: nextDay.toISOString(), 
    });

    return response.data.items;
      
}

exports.getUpcomingEvents = getUpcomingEvents;
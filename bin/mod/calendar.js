const calendar = require('../lib/calendar');
const store = require('data-store')({ path: process.cwd() + '/bin/core/calendar.json' });
const jsonfile = require('jsonfile');
const discord = require('./discord');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

function getTextBetweenTags(input) {
    var regex = /<a[^>]*>(.*?)<\/a>/;
    var match = regex.exec(input);
    if (match && match.length > 1) {
      return match[1];
    } else {
      return null; // ou gérez le cas où aucune correspondance n'est trouvée
    }
  }


const fetch = async () => {

    const events = await calendar.getUpcomingEvents('5609@holbertonstudents.com');
    const dataFilePath = process.cwd() + '/bin/core/events.json';

    let storedEventIds = store.get('events') || [];

    events.forEach(async (event) => {
        const eventId = event.recurringEventId || event.id;
        const eventName = event.summary;
      
        const date = new Date(event.start.dateTime);
        const unixTimestamp = Math.floor(date.getTime() / 1000);


        if (storedEventIds.includes(eventId)) {
            return;
        }

        if ( eventName.toLowerCase().includes('stand-up') || eventName.toLocaleLowerCase().includes('france wrap-up c#19 + c#18')) {
            return;
        }   

        if (event.attendees && event.attendees.length < 10) {
            return;
        }
            
        storedEventIds.push(eventId);

        const regex = /https?:\/\/[^\s]+/;
        const links = event.description.match(regex);
        const Link = links[0] || null;
        const DisplayLink = Link ? "" : event.description;

        let components = null;
        if (Link) {
            const open = new ButtonBuilder()
            .setLabel('Ouvrir l`évènement')
            .setURL(Link)
            .setStyle(ButtonStyle.Link);
    
            components = [new ActionRowBuilder().addComponents(open)];
        }
          
        // const content = `${message} @everyone [${user.display_name}]`;
        const content = `**${eventName}** à <t:${unixTimestamp}:t> (<t:${unixTimestamp}:R>) @everyone ${DisplayLink} `;
        await discord.sendMessage('1107736102565060799', {content, components})
    });
    store.set('events', storedEventIds);
}
exports.fetch = fetch;

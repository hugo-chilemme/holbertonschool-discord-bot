const { exec } = require('child_process');


const ask = async (answer, cb) => {
    const { exec } = require('child_process');
    
    let text = "";
    let timeout = 0;
    const command = `node ${process.cwd()}/bin/ext/index.js "${answer}"`;
    
    const child = exec(command);
    
    child.stdout.on('data', (data) => {

        if (data.split('\n')[0].trim() == "[end terminal]") {
            console.log('Check');
            return cb(text);
        }

        let t;
        try {
            t = atob(data);
        } catch(e) {
            return;
        }
        if (t.trim() == "") {
            return;
        }
        text = t;
        if (timeout > new Date().getTime()) {
            return;
        }
        timeout = new Date().getTime() + 250;
        cb(t);
    });

  }

const onconnect = (client) => {


    client.on('interactionCreate', async (interaction) => {
        if (interaction.commandName !== "Ask Bing AI") {
            return;
        }
        await interaction.deferReply();
        const m = interaction.options.get('message').message;

        interaction.editReply({content: `**Searching:** ${m.content} ...`});


        ask(m.content, (res) => {
            interaction.editReply({content: `${res}`});
        });

       
    });
}


module.exports = onconnect;

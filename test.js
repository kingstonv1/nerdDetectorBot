var axios = require('axios');
const { REST, Routes, escapeItalic, Options } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const EventEmitter = require('events');
const { rawListeners } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
const rest = new REST({ version: '10'}).setToken('MTAxOTQyNDY2NjEwMTc2NDIxOA.GharUk.E9TpXqKrwjv7VRBxn3koUQ3e1Nmq8-omfYycZE');
const CLIENT_ID = '1019424666101764218';
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
    });

EventEmitter.setMaxListeners(14);

const commands =
[
    {
        name: "ping",
        description: "pong :)"
    },
    {
        name: "compliment",
        description: "let someone know they're very cool",
        Options: [{ name: 'user', description: 'the user to compliment' }]
    }

];

async function getCompliment(url) 
{
    const res = await axios.get('https://complimentr.com/api');
    //return JSON.parse(res);
    return res.data;
}

(async () => 
{
    try 
    {
        console.log('Started refresing application slash commands.');
//        await rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands});
        console.log('Successfully reloaded application slash commands.');
    }
    catch (error) 
    {
        console.error(error);
    }
})();

client.on('ready', () => 
{
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('interactionCreate', async interaction => 
{
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') 
    {
        await interaction.reply('Pong!');
    }
    else if (interaction.commandName === 'compliment')
    {
        
    }
});

async function escape() 
{
    await new Promise(resolve => setTimeout(resolve, 500));
    readline.on('line', (input) => { if (input == 'stop') { process.exit(0); }});
}

escape();
console.log(getCompliment());

//client.login('MTAxOTQyNDY2NjEwMTc2NDIxOA.GharUk.E9TpXqKrwjv7VRBxn3koUQ3e1Nmq8-omfYycZE');
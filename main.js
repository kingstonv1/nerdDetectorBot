//Define Constants

//For HTTP & HTTPS Requests
var axios = require('axios');
//Sensitive info hidden from the Git Repo
const keys = require("./keys.json");
//My timer class, used to handle bot uptime timer
const timer_ = require("./timer.js");

const { REST, Routes, escapeItalic, Options } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const EventEmitter = require('events');
const { rawListeners } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
const rest = new REST({ version: '10'}).setToken(keys.token);
const readline = require('readline').createInterface(
    {
        input: process.stdin,
        output: process.stdout
    });

    let compliment;
    
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

//Define Functions

async function getCompliment(url) 
{
    const res = await axios.get('https://complimentr.com/api');
    //return JSON.parse(res);
    console.log(`Data from your api query: ${res.data}`);
    return res.data;
}

//handleInput runs in the background, ending the program if the user ever types "stop". May be expanded to handle other arguments.
async function handleInput() 
{
    await new Promise(resolve => setTimeout(resolve, 500));
    readline.on('line', (input) => { if (input == 'stop') { process.exit(0); }});
}


//Initalize discord slash commands

(async () => 
{
    try 
    {
        console.log('Started refresing application slash commands.');
//        await rest.put(Routes.applicationCommands(keys.appid), {body: commands});
        console.log('Successfully reloaded application slash commands.');
    }
    catch (error) 
        { console.error(error); }
})();


//Bot's reactions to a variety of events

client.on('ready', () => //On program start
{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ type: "Detecting", name: "nerds..."}], status: "online" });
});

client.on('interactionCreate', async interaction => //When the user interacts with the bot, typically via a slash command
{
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') 
    {
        await interaction.reply('Pong!');
    }
    else if (interaction.commandName === 'compliment')
    {
        compliment = getCompliment();
        await interaction.reply(`@${interaction.author.name}, ${compliment} :)`);
    }
});

client.on('messageCreate', async message => //Any time a message is sent
{
    //If a message is sent by Isaac (currently me)
    if (message.author.id === '546827180404113426') 
    {
        message.react('\:nerding\:');
    }
});


handleInput();
console.log(JSON.stringify(getCompliment()));
client.login(keys.token);
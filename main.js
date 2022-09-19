//Define Constants

//For HTTP & HTTPS Requests
const axios = require('axios');
//Sensitive info hidden from the Git Repo
const keys = require('dotenv').config();
//My timer class, used to handle bot uptime timer
const timer_ = require('./timer_.js');
const uptime = new timer_();

const { REST, Routes, escapeItalic, Options } = require('discord.js');
const { Client } = require('discord.js');
const EventEmitter = require('events'); //Could possibly be removed? I'm not going to do it while I can't test, though.
const { rawListeners } = require('process'); //^^^
const { SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [7796] });
const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);
const readline = require('readline').createInterface({ input: process.stdin,    output: process.stdout });


let commands = new Array(); 

const ping = new SlashCommandBuilder().setName('ping').setDescription('pong :)');

const compliment = new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('Let someone know how awesome they are.')
    .addUserOption(option =>
        option.setName('user')
        .setDescription('The user to compliment')
        .setRequired(true));
    
commands.push(compliment.toJSON());
commands.push(ping.toJSON());

//Define Functions

async function get(what) 
{
    let res;    
    switch (what) 
    {
        case 'compliment':
            res = await axios.get('https://complimentr.com/api');
            break;
        case 'article':
            res = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
            break;
    
        default:
            throw 'No selection for what to get.';
    }
    return res;
}

//handleInput runs in the background, checking the user's command line input against a list of commands.
async function handleInput() 
{
    await new Promise(resolve => setTimeout(resolve, 500));
    readline.on('line', async (input) => 
    { 
        let res;
        
        switch (input) {
            case 'stop':
                process.exit(0);
            
            case 'wiki':
                res = await get('article');
                console.log(`Your article: ${res.data.content_urls.desktop.page}`);
                break;
            
            case 'comp':
                res = await get('compliment');
                console.log(`Your compliment: ${res.data.compliment}`);
                break;
        
            default:
                console.log('invalid input.');
                break;
        }
    });
}

//Initalize discord slash commands

(async () => 
{
    try 
    {
        console.log('Started refresing application slash commands.');
        //Disabled while I'm at school. Throws an exception due to the firewall
        //await rest.put(Routes.applicationCommands(process.env.APPID), {body: commands});
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

client.on('interactionCreate', async interaction  => //When the user interacts with the bot, typically via a slash command
{
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') 
    {
        await interaction.reply('Pong!');
    }
    else if (interaction.commandName === 'compliment')
    {
        let res = await get('compliment');
        await interaction.reply(`${interaction.options.getUser('user')}, ${res.data.compliment} :)`);
    }
});

client.on('message', async message => //Any time a message is sent
{
    //If a message is sent by Isaac (currently me)
    message.reply(`Your ID is: ${message.user.id}.`);
    if (message.user.id === '546827180404113426') 
    {
        message.react('\:nerding\:');
    }
});


handleInput();
/*
Removing discord features while I work on other things (I am at school and the firewall smites my application)
client.login(process.env.TOKEN);
*/
setInterval(() => process.stdout.write(uptime.increment()), 1000);
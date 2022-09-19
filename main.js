//Define Constants

//For HTTP & HTTPS Requests
var axios = require('axios');
//Sensitive info hidden from the Git Repo
const keys = require('./keys.json');
//My timer class, used to handle bot uptime timer
const timer_ = require('./timer_.js');
const uptime = new timer_();

const { REST, Routes, escapeItalic, Options } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const EventEmitter = require('events');
const { rawListeners } = require('process');
const { SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [7796] });
const rest = new REST({ version: '10'}).setToken(keys.token);
const readline = require('readline').createInterface(
    {
        input: process.stdin,
        output: process.stdout
    });

    let comp;
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
            res = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random');
            break;
    
        default:
            throw 'No selection for what to get.';
    }
    return res;
}

//handleInput runs in the background, ending the program if the user ever types "stop". May be expanded to handle other arguments.
async function handleInput() 
{
    await new Promise(resolve => setTimeout(resolve, 500));
    readline.on('line', async (input) => 
    { 
        if (input == 'stop') { process.exit(0); }
        
        //debug commands below
        if (input === 'wiki') 
        {
            let res = await get('article');
            console.log(`Your article: ${res.keys}`);
        }
        if (input === 'comp') 
        { 
            let res = await get('compliment');
            console.log(`Your compliment: ${res.data.compliment}`);
        }
        
        //Prints a message if input does not match a command.
        else { console.log('invalid input.'); }
    });
}

//Initalize discord slash commands

(async () => 
{
    try 
    {
        console.log('Started refresing application slash commands.');
        
        
        
        //Disabled while I'm at school. Throws an exception due to the firewall
        //await rest.put(Routes.applicationCommands(keys.appid), {body: commands});
        
        
        
        
        
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
client.login(keys.token);

*/

setInterval(() => process.stdout.write(uptime.increment()), 1000);
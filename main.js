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
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer } = require('@discordjs/voice');
const EventEmitter = require('events');
const { rawListeners } = require('process');
const { channel } = require('diagnostics_channel');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildScheduledEvents]});
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
        
    const outro = new SlashCommandBuilder()
        .setName('outro')
        .setDescription('Play an epic outro 😎');
        
    commands.push(compliment.toJSON());
    commands.push(ping.toJSON());
    commands.push(outro.toJSON());

//Define Functions

async function getCompliment() 
{
    const res = await axios.get('https://complimentr.com/api');
    return res;
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
        await rest.put(Routes.applicationCommands(keys.appid), {body: commands});
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
        let res = await getCompliment();
        await interaction.reply(`${interaction.options.getUser('user')}, ${res.data.compliment} :)`);
    }
    else if (interaction.commandName === 'outro')
    {
        // const connection = joinVoiceChannel
        // ({
        //     channelId: interaction.user.voice.channel.id,
        //     guildId: interaction.user.guild.id,
        //     adapterCreator: interaction.user.voice.channel.id
        // });
        const player = createAudioPlayer();
        const outro = createAudioResource('/home/kingstonv/outro.mp3');
        interaction.member.voice.channel.join();
        player.play(outro);
        player.stop();
        // connection.destroy();
    }
});

client.on('messageCreate', async message => //Any time a message is sent
{
    //If a message is sent by Isaac
    if (message.author.id === '546827180404113426') 
    {
        const nerding = client.emojis.cache.find(emoji => emoji.name === "nerding");
        message.react(nerding);
    }
    if (message.content.indexOf('3232') !== -1) 
    {
        message.reply('don\'t do that.');
    }
});


handleInput();
client.login(keys.token);
setInterval(() => process.stdout.write(uptime.increment()), 1000);
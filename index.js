// Import the Discord.js library
const { Client, GatewayIntentBits, ClientUser, Guild } = require('discord.js');
const { BOT_TOKEN } = require('./credentials');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const MUSIC_CHAT_CHANNEL_GROUP = '1012830973139890276';
const VOICE_CHAT_CHANNEL = '798528429091061780';
const MUSIC_CHANNEL = '792285032713945119';
const PING_CHANNEL = '693712564588380200'
const CODENAMES_CHAT_CHANNEL_GROUP = '1227423048949301268';
const CODENAMES_CHAT_CHANNEL = '964213567828156466';
const CODENAMES_VOICE_CHANNEL = '1126902663607484476';
const CODENAMES_PING = '963037960230551582';

let timeoutID = null;
let cnTimeoutID = null;
const TIMEOUT = 3600000;


const hideVC = (guild) => {
    const channel = guild.channels.cache.get(MUSIC_CHAT_CHANNEL_GROUP);
    const everyoneRole = channel.guild.roles.everyone; // @everyone role
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: false, // Deny view access for everyone
    });
    console.log(`Channel hidden for everyone in the server.`);
       
}

const showVC = (guild) => {
    const channel = guild.channels.cache.get(MUSIC_CHAT_CHANNEL_GROUP);
    const everyoneRole = channel.guild.roles.everyone; // @everyone role
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: null, // Deny view access for everyone
    });
    console.log(`Channel shown for everyone in the server.`);
       
}

const hideCN = (guild) => {
    const channel = guild.channels.cache.get(CODENAMES_CHAT_CHANNEL_GROUP);
    const everyoneRole = channel.guild.roles.everyone; // @everyone role
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: false, // Deny view access for everyone
    });
    console.log(`CN hidden for everyone in the server.`);
       
}

const showCN = (guild) => {
    const channel = guild.channels.cache.get(CODENAMES_CHAT_CHANNEL_GROUP);
    const everyoneRole = channel.guild.roles.everyone; // @everyone role
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: null, // Deny view access for everyone
    });
    console.log(`CN shown for everyone in the server.`);
       
}


// Event: Bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Event: Message received
client.on('messageCreate', (message) => {
    // Ignore messages from the bot itself or other bots
    if (message.author.bot) return;
    if (message.channelId === PING_CHANNEL || '768066072879300648') {
        console.log(message.mentions);
        if (message.mentions.roles.has(CODENAMES_PING)) {
            // show_codenames function
            message.channel.send(`Codenames Portal opened \n\n quick someone, join the <#${CODENAMES_VOICE_CHANNEL}> to keep the portal open\n chat here <#${CODENAMES_CHAT_CHANNEL}>`);
            showCN(message.channel.guild);
            clearTimeout(cnTimeoutID);
            cnTimeoutID = setTimeout(hideCN, TIMEOUT, message.channel.guild);
            // message link to codenames in pings channel
        }
    }
    //if (message.mentions)

    // Basic command: Respond to "!ping"
    if (message.content === '!ping') {
        message.channel.send('Pong! 🏓');
    }

    // Add more commands here
    if (message.content === '!hello') {
        message.reply('Hello there! 👋');
    }
});



// Event: Slash command interaction (optional setup)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong via Slash Command!');
    }
});

// Login to Discord with your bot token


/**
 * Requirements - 
 * -> It can change the view channel permmission from neutral to hidden, 
 *  if someone leaves the channel should disapper after a fixed time.
 * -> When you make a certain ping then it should show the corresponding channel. 
 *  And when everyone leaves the channel the bot should hide the channel after a fixed time. 
 * -> Optional: The channel should disapper based on texts in some other channel
 * -> VC channels should ignore bots (i.e. bots should not be considered as active users)
 * -> if someone is sleeping in VC, they should get kicked out after a timeout
 */

/** 
 * If a user joins Voice channel ->
 * For audiochat channel -> change permissions so that it's visible to everyone
 * How to detect if a new user joins a voice channel?
 * How to change the permissions of a given channel ID?
 * 
 */


client.on('voiceStateUpdate', (oldState, newState) => {
    console.log(oldState);
    console.log(newState);

    // User Disconnected
    if(oldState.channelId === VOICE_CHAT_CHANNEL || oldState.channelId === MUSIC_CHANNEL) {
                
        const members = oldState.channel.members;

        let count = 0;

        members.forEach(member => {
            if(member.user.bot === false) count++;
        });

        if(count < 1) {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(hideVC, TIMEOUT, oldState.guild);
        
            // if timeoutID is not null, get the timeout and cancel it
            // create a new timeout, set timeoutID
        }
      
    } else if(oldState.channelId === CODENAMES_VOICE_CHANNEL){
                        
        const members = oldState.channel.members;

        let cnCount = 0;

        members.forEach(member => {
            if(member.user.bot === false) cnCount++;
        });
        if(cnCount < 1) {
            clearTimeout(cnTimeoutID);
            cnTimeoutID = setTimeout(hideCN, TIMEOUT, oldState.guild);
        
            // if timeoutID is not null, get the timeout and cancel it
            // create a new timeout, set timeoutID
        } 

    }
    // User Connected 
    if(newState.channelId === MUSIC_CHANNEL) {
        // if user (newstate.member.user.bot) is not bot, then if timeoutId is not null, remove the timeout,
        // set the timeoutId to null
        showVC(oldState.guild);

    } else if(newState.channelId === CODENAMES_VOICE_CHANNEL) {
        showCN(oldState.guild);
        clearTimeout(cnTimeoutID);
    }

    
});
client.login(BOT_TOKEN);
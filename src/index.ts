import { Message, TextChannel, VoiceChannel } from "discord.js";
import { BOT_TOKEN } from './credentials';
import { CHANNELS, INACTIVITY_TIMEOUT } from "./constants";
import { hideChannel, isCodeNamesVoiceChannel, isVoiceOrMusicChannel, showChannel } from "./utilities";
import { client } from "./client";

let voicechatTimeoutId: NodeJS.Timeout|undefined;
let codenamesChatTimeoutId: NodeJS.Timeout|undefined;

// Event: Bot is ready
client.once('ready', () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    } else {
        console.log('Logged in, but client.user is null.');
    }
});

// Event: Message received
client.on('messageCreate', (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId === CHANNELS.PING_CHANNEL) {
        if (message.mentions.roles.has(CHANNELS.CODENAMES_PING)) {
            const pingsChannel = message.channel as TextChannel;
            const codenamesChannelGroup = client.channels.cache.get(CHANNELS.CODENAMES_CHAT_CHANNEL_GROUP) as TextChannel;
            showChannel(codenamesChannelGroup);
            pingsChannel.send(`Codenames Portal opened \n\n Quick someone, join the <#${CHANNELS.CODENAMES_VOICE_CHANNEL}> to keep the portal open\n chat here <#${CHANNELS.CODENAMES_CHAT_CHANNEL}>`);
            clearTimeout(codenamesChatTimeoutId);
            codenamesChatTimeoutId = setTimeout(hideChannel, INACTIVITY_TIMEOUT, codenamesChannelGroup);
        }
    }
});

// Event: Voice State Update
client.on('voiceStateUpdate', (oldState, newState) => {

    if (isVoiceOrMusicChannel(oldState.channelId) || isVoiceOrMusicChannel(newState.channelId)) {
        const voiceChannel = client.channels.cache.get(CHANNELS.VOICE_CHANNEL) as VoiceChannel;
        const musicChannel = client.channels.cache.get(CHANNELS.MUSIC_CHANNEL) as VoiceChannel;
        const voiceChatChannelGroup = client.channels.cache.get(CHANNELS.MUSIC_CHAT_CHANNEL_GROUP) as TextChannel;

        const members = new Map([...voiceChannel.members, ...musicChannel.members]);
        const memberCount = Array.from(members.values()).filter(member => !member.user.bot).length;

        if (memberCount < 5) {
            clearTimeout(voicechatTimeoutId);
            voicechatTimeoutId = setTimeout(hideChannel, INACTIVITY_TIMEOUT, voiceChatChannelGroup);
        } else {
            clearTimeout(voicechatTimeoutId);
            showChannel(voiceChatChannelGroup);
        }
    }
    if ( isCodeNamesVoiceChannel(oldState.channelId) ) {
        const codenamesVoiceChannel = client.channels.cache.get(CHANNELS.CODENAMES_VOICE_CHANNEL) as VoiceChannel;
        const codenamesChannelGroup = client.channels.cache.get(CHANNELS.CODENAMES_CHAT_CHANNEL_GROUP) as TextChannel;
        const members = codenamesVoiceChannel.members;
        
        let memberCount = Array.from(members.values()).filter(member => !member.user.bot).length;
        
        if(memberCount < 1) {
            clearTimeout(codenamesChatTimeoutId);
            codenamesChatTimeoutId = setTimeout(hideChannel, INACTIVITY_TIMEOUT, codenamesChannelGroup);
        } else {
            clearTimeout(codenamesChatTimeoutId);
            showChannel(codenamesChannelGroup);
        }

    }
});

client.login(BOT_TOKEN);
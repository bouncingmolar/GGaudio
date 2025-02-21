import { TextChannel, VoiceChannel } from "discord.js";
import { CHANNELS } from "./constants";


export const hideChannel = (channel: VoiceChannel|TextChannel) => {
    const everyoneRole = channel.guild.roles.everyone;
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: false,
    });
}

export const showChannel = (channel: VoiceChannel|TextChannel) => {
    const everyoneRole = channel.guild.roles.everyone;
    channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: null,
    });
}

export const isVoiceOrMusicChannel = (channelId: string | null) => channelId && [CHANNELS.VOICE_CHANNEL, CHANNELS.MUSIC_CHANNEL].includes(channelId);

export const isCodeNamesVoiceChannel = (channelId: string | null) => channelId && [CHANNELS.CODENAMES_VOICE_CHANNEL].includes(channelId);
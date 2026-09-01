import { TextChannel, VoiceChannel } from "discord.js";
import { CHANNELS } from "./constants";


export const hideChannel = async (
    channel: VoiceChannel | TextChannel
) => {
    const everyoneRole = channel.guild.roles.everyone;

    await channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: false,
    });
};

export const showChannel = async (
    channel: VoiceChannel | TextChannel
) => {
    const everyoneRole = channel.guild.roles.everyone;

    await channel.permissionOverwrites.edit(everyoneRole, {
        ViewChannel: null,
    });
};

export const getHumanMemberCount = (channel: VoiceChannel): number => {
    return channel.members.filter(member => !member.user.bot).size;
} 

export const isVoiceOrMusicChannel = (channelId: string | null) => channelId && [CHANNELS.VOICE_CHANNEL, CHANNELS.MUSIC_CHANNEL].includes(channelId);

export const isCodeNamesVoiceChannel = (channelId: string | null) => channelId && [CHANNELS.CODENAMES_VOICE_CHANNEL].includes(channelId);

export const isGarticPhoneVoiceChannel = (channelId: string | null) => channelId && [CHANNELS.GARTICPHONE_VOICE_CHANNEL].includes(channelId);
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { joinVoiceChannel } = require("@discordjs/voice")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Make bot join your current voice channel."),
	execute: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to make this command work.`).setColor(`Red`)] })
        if (!interaction.member.voice.channel.joinable) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> I can't join the voice channel.`).setColor(`Red`)] })
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Joining ${interaction.member.voice.channel.name}`).setColor(`Green`)] })
        joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        }).catch(err => {message.channel.send({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> I can't join that voice channel.`).setColor(`Red`)] })})
    },
}
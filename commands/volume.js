const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change the volume of the music.")
        .addStringOption(option =>
            option.setName("value").setDescription("The value of new volume.").setRequired(true)
        ),
    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        const value = interaction.options.getString("value")

        // check to make sure no error while run this command
        if (!queue || (!queue.playing && !queue.connection))
        {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
            return;
        }

        if (!value || !Number(value)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Invaild Volume Number.`).setColor(`Red`)] });
        if (value > 100) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Value Number is too high.`).setColor(`Red`)] });

        // setting value
        queue.setVolume(Number(value));
        //reply message
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Change the volume to **${Number(value)}**.`).setColor(`Green`)] })
    }
}
const { ChannelType, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('msg')
        .setDescription('Setup the embed.')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Insert un texte')
                .setRequired(true))
        .toJSON(),
];

module.exports = commands[0];
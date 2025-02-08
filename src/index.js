const { Client, GatewayIntentBits, Routes, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, InteractionType } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMembers], partials: [Partials.Channel, Partials.Message, Partials.Reaction] });
const config = require("./config/config.json");
const database = require("./database.js");
const { LoadFiles, LoadCommands } = require("./loads.js")
const Jennie = require('./dependances/interactionCreate.js');

client.once('ready', async () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    LoadFiles({ client: client, Jennie: Jennie, config: config, database: database });
    const commands = await LoadCommands(client)

    commands.forEach(async (commandes) => {
        await client.guilds.cache.get(config.guildid).commands.create(commandes);
    })

    await client.guilds.cache.get(config.guildid).members.fetch().then(() => {
        console.log('Mise en cache des utilisateurs terminée.');
    })
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        if (Jennie.interactionsHandlers[interaction.commandName]) {
            Jennie.interactionsHandlers[interaction.commandName](interaction);
        }
    }

    if (interaction.isButton() || interaction.isModalSubmit()) {
        if (Jennie.interactionsHandlers[interaction.customId]) {
            Jennie.interactionsHandlers[interaction.customId](interaction);
        }
    }
});

client.on('messageCreate', async (message) => {
    if (Jennie.messagesHandlers[message.channelId]) {
        Jennie.messagesHandlers[message.channelId](message);
    }
});

client.on('channelCreate', (channel) => {
    if (Jennie.salonsHandlers[channel.parentId]) {
        Jennie.salonsHandlers[channel.parentId](channel);
    }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (Jennie.messagesEditHandlers[newMessage.channelId]) {
        Jennie.messagesEditHandlers[newMessage.channelId](newMessage);
    }
})

client.login(config.token);

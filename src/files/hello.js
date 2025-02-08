module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("bonjour", ["829469771833278534" /*Chief officee*/] /*Roles*/, async (interaction) => {
        try {
            interaction.channel.sendTyping()

            setTimeout(async () => {
                const options = interaction.options.data[0].value;
                console.log(`L'utilisateur \x1b[42m\x1b[37m${interaction.user.username}\x1b[0m vient de faire un message écrit dans le salon \x1b[42m\x1b[37m${interaction.channelId}\x1b[0m avec pour message \x1b[42m\x1b[37m${interaction.options.data[0].value}`)
                return client.channels.cache.get(interaction.channelId).send(`Salut, ${options} j'espère que la journée ce passe bien !`);
            }, 3500);

            interaction.reply({ content: ".", ephemeral: true });
        } catch (error) {
            console.error('Une erreur est survenue :', error);
            interaction.reply('Une erreur est survenue. Merci de réessayer ou contacter un administrateur.');
        }
    });

    Jennie.RunUserInteraction("bonsoir", ["829469771833278534" /*Chief officee*/] /*Roles*/, async (interaction) => {
        try {
            interaction.channel.sendTyping()

            setTimeout(async () => {
                const options = interaction.options.data[0].value;
                return client.channels.cache.get(interaction.channelId).send(`Salut, ${options} j'espère que la soirée ce passe bien !`);
            }, 3500);

            interaction.reply({ content: ".", ephemeral: true });
        } catch (error) {
            console.error('Une erreur est survenue :', error);
            interaction.reply('Une erreur est survenue. Merci de réessayer ou contacter un administrateur.');
        }
    });
};
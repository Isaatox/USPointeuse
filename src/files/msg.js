module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("msg", [/*Isaatox*/ "638434129234624512", /*Suzaku*/ "473181497763823616", /*Yemekinhoo*/ "320994501441355783", /*Chief Office*/ "829469771833278534", /*Dev*/ "945368445044789329"], async (interaction) => {
        interaction.reply({ content: "Message envoyé", ephemeral: true }).then(() => {
            interaction.channel.sendTyping()
            setTimeout(async () => {
                await interaction.channel.send(interaction.options.data[0].value).then((msg) => {
                    console.log(`L'utilisateur \x1b[42m\x1b[37m${interaction.user.username}\x1b[0m vient de faire un message écrit dans le salon \x1b[42m\x1b[37m${interaction.channelId}\x1b[0m avec pour message \x1b[42m\x1b[37m${interaction.options.data[0].value}\x1b[0m - Id du message \x1b[42m\x1b[37m${msg.id}\x1b[0m`)
                })
            }, 3500);
        })
    });
};
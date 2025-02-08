const messages = []

module.exports = async ({ client, Jennie }) => {
    Jennie.RunUserInteraction("remind", [] /*Roles*/, async (interaction) => {
        try {
            messages.push({ user: interaction.member.id, time: parseInt(interaction.options.data[1].value) * 60000, text: interaction.options.data[0].value, channel: interaction.channelId })
            remind2(client)
            await interaction.reply({ content: "Message sauvegardé", ephemeral: true })
        } catch (error) {
            console.log("Remind 1 : " + error)
        }
    });
};

function remind2(client) {
    messages.forEach(({ user, time, text, channel }, index) =>
        setTimeout(() => {
            if (messages.length > 0) {
                client.channels.cache.get(channel).send(`<@!${user}> : ${text}`)
            }
            messages.splice(index, 1);
        }, time)
    );
}
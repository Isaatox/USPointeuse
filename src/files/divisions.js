module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("divisions", [], async (interaction) => {
        try {
            const fetchedMessage = await client.channels.cache.get("1169783404930277386").messages.fetch('1176303693759516782');
            const embed = fetchedMessage.embeds;

            embed[0].fields.forEach(field => {
                try {
                    if (field.name === interaction.options.data[0].value) {
                        field.value = parseInt(interaction.options.data[1].value) === 1 ? "🟢" : "🔴";
                    }
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            });

            await fetchedMessage.edit({ embeds: embed });

            return interaction.reply({ content: "Message mis a jour", ephemeral: true })
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });
};
const { Client, GatewayIntentBits, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, InteractionType } = require("discord.js");

module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("leadrapport", [] /*Roles*/, async (interaction) => {
        try {
            const modallead = new ModalBuilder()
                .setCustomId('rapportlead')
                .setTitle("Rapport lead terrain");

            const Title = new TextInputBuilder()
                .setCustomId('titre')
                .setLabel("Titre")
                .setStyle(TextInputStyle.Short);

            const Justification = new TextInputBuilder()
                .setCustomId('justi')
                .setLabel("Zone de texte")
                .setStyle(TextInputStyle.Paragraph);

            const titre = new ActionRowBuilder().addComponents(Title);
            const firstActionRow = new ActionRowBuilder().addComponents(Justification);

            modallead.addComponents(titre, firstActionRow);
            await interaction.showModal(modallead);
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });

    Jennie.RunUserInteraction("rapportlead", [] /*Roles*/, async (interaction) => {
        try {
            client.channels.cache.get("1082975769363488768").send({
                "embeds": [
                    {
                        "type": "rich",
                        "title": `${interaction.fields.getTextInputValue('titre')}`,
                        "description": `${interaction.fields.getTextInputValue('justi')}`,
                        "color": 0x9d8d26,
                        "author": {
                            "name": `Rapport de ${interaction.member.nickname}`,
                        },
                        "footer": {
                            "text": "Réalisé le " + new Date().toLocaleDateString('fr')
                        },
                    }
                ]
            });

            interaction.reply({ content: "Le rapport est envoyé ✅", ephemeral: true })
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });
};
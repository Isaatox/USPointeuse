const { Client, GatewayIntentBits, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, InteractionType } = require("discord.js");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const uuidSalon = loadMapFromFile("./src/uuids.json")

module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunChannelCreate("1097563731602448574" /* ID de la categorie d'ouverture d'enquete*/, async (channel) => {
        uuidSalon.set(channel.id, [uuidv4(), channel.name]);

        console.log(`UUID associé au salon ${channel.id}: ${uuidSalon} ${channel.name}`);
        saveMapToFile(uuidSalon, './src/uuids.json');
    });

    Jennie.RunUserInteraction("demande_co_enquete", [] /*Roles*/, async (interaction) => {
        try {
            const modal = new ModalBuilder()
                .setCustomId('rapport')
                .setTitle("Demande d'une ouverture d'enquete");

            const Title = new TextInputBuilder()
                .setCustomId('titre')
                .setLabel("Titre de l'enquete")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(50);

            const Justification = new TextInputBuilder()
                .setCustomId('justi')
                .setLabel("Description sur l'enquete")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(450);

            const titre = new ActionRowBuilder().addComponents(Title);
            const firstActionRow = new ActionRowBuilder().addComponents(Justification);


            modal.addComponents(titre, firstActionRow);
            await interaction.showModal(modal);
        } catch (error) {
            console.log("Liste CMDRapport : " + error)
        }
    });

    Jennie.RunUserInteraction("rapport", [] /*Roles*/, async (interaction) => {
        const roleIDs = ['1117175502592032852', "829469771833278534"];

        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('demande_enquete')
                .setLabel("Accepter la demande d'enquête")
                .setStyle(ButtonStyle.Success)
                .setDisabled(false),
        );

        roleIDs.forEach((roleID) => {
            const role = interaction.guild.roles.cache.get(roleID);

            if (!role) {
                console.log(`Le rôle avec l'ID ${roleID} n'existe pas.`);
                return;
            }

            role.members.forEach((member) => {
                if (!member.user.bot) {
                    try {
                        member.send({
                            "embeds": [
                                {
                                    "type": "rich",
                                    "title": `Nom de l'enquête : ${interaction.fields.getTextInputValue('titre')}`,
                                    "description": `Une demande d'enquête vient d'être **émise** le **${new Date(interaction.createdTimestamp).toLocaleDateString('fr') + " à " + new Date(interaction.createdTimestamp).toLocaleTimeString('fr')}** par **${interaction.member.nickname}**`,
                                    "color": 0x3b8a91,
                                    "author": {
                                        "name": `Federal Bureau of Investigation`,
                                        "url": `https://i.imgur.com/ykbsULq.png`
                                    },
                                    "fields": [
                                        {
                                            "name": `Description`,
                                            "value": `${interaction.fields.getTextInputValue('justi')}`
                                        }
                                    ],
                                    "thumbnail": {
                                        "url": `https://i.imgur.com/ykbsULq.png`,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "footer": {
                                        "text": `Federal Bureau of Investigation`,
                                        "icon_url": `https://i.imgur.com/ykbsULq.png`
                                    }
                                }
                            ], components: [row], fetchReply: true
                        }).then(() => {
                            console.log(`Le message demande d'enquete a été reçu pour ${member.user.username}`)
                        })
                    } catch (error) {
                        console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                    }
                }
            });
        });

        interaction.reply({ content: "Les demandes sont envoyées ✅", ephemeral: true });
    });

    Jennie.RunUserInteraction("demande_enquete", [] /*Roles*/, async (interaction) => {
        const categoryID = '1097563731602448574';
        const guild = client.guilds.cache.get('829469307518844950');

        try {
            const channel = await guild.channels.create({
                name: interaction.message.embeds[0].title.replace("Nom de l'enquête : ", ""),
                type: 0,
                parent: categoryID
            });
            channel.send("<@&1097263485135618168> Ouverture d'une enquete : https://docs.google.com/document/d/1vyZpgVuvBfqvGkl-DTxRJIHAv_vGGPS7aKkBbecSbsA/edit?usp=sharing")
            await interaction.reply(`Le salon ${channel} a été créé dans la catégorie spécifique.`);
        } catch (error) {
            console.error('Erreur lors de la création du salon :', error);
            await interaction.reply('Une erreur s\'est produite lors de la création du salon.');
        }
    });

    Jennie.RunUserInteraction("classeraffaire", [] /*Roles*/, async (interaction) => {
        const [uuid, nomeEnquete, member, messageid] = uuidSalon.get(interaction.channelId);

        if (uuid) {
            interaction.channel.setParent("1104077235176091668")

            const buttonLabel = "Rouvrir l'enquête";

            const row = new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setCustomId('reopen_button')
                    .setLabel(buttonLabel)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(false),
            );
            console.log(messageid, "Affaire clasee")
            if (messageid !== undefined) {
                interaction.channel.messages.fetch(messageid).then(message => {
                    message.delete()
                        .then(async () => {
                            const reply = await interaction.reply({
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `Nom de l'enquete : ${nomeEnquete}`,
                                        "description": `Cette affaire a été **classée** le **${new Date(interaction.createdTimestamp).toLocaleDateString('fr') + " à " + new Date(interaction.createdTimestamp).toLocaleTimeString('fr')}** par **${interaction.member.nickname}**`,
                                        "color": 0x3b8a91,
                                        "author": {
                                            "name": `Federal Bureau of Investigation`,
                                            "url": `https://i.imgur.com/ykbsULq.png`
                                        },
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/ykbsULq.png`,
                                            "height": 0,
                                            "width": 0
                                        },
                                        "footer": {
                                            "text": `Federal Bureau of Investigation`,
                                            "icon_url": `https://i.imgur.com/ykbsULq.png`
                                        }
                                    }
                                ], components: [row], fetchReply: true
                            })

                            uuidSalon.set(interaction.channelId, [uuid, nomeEnquete, interaction.member.nickname, reply.id]);
                        })
                        .catch(error => {
                            console.error("Une erreur s'est produite lors de la suppression du dernier message du bot :", error);
                        });
                })
                    .catch(error => {
                        console.error("Une erreur s'est produite lors de la récupération du dernier message du bot :", error);
                    });
            } else {
                const reply = await interaction.reply({
                    "embeds": [
                        {
                            "type": "rich",
                            "title": `Nom de l'enquete : ${nomeEnquete}`,
                            "description": `Cette affaire a été **classée** le **${new Date(interaction.createdTimestamp).toLocaleDateString('fr') + " à " + new Date(interaction.createdTimestamp).toLocaleTimeString('fr')}** par **${interaction.member.nickname}**`,
                            "color": 0x3b8a91,
                            "author": {
                                "name": `Federal Bureau of Investigation`,
                                "url": `https://i.imgur.com/ykbsULq.png`
                            },
                            "thumbnail": {
                                "url": `https://i.imgur.com/ykbsULq.png`,
                                "height": 0,
                                "width": 0
                            },
                            "footer": {
                                "text": `Federal Bureau of Investigation`,
                                "icon_url": `https://i.imgur.com/ykbsULq.png`
                            }
                        }
                    ], components: [row], fetchReply: true
                })

                uuidSalon.set(interaction.channelId, [uuid, nomeEnquete, interaction.member.nickname, reply.id]);
            }
        } else {
            interaction.reply({ content: "Impossible de classée cette affaire", ephemeral: true })
        }

        saveMapToFile(uuidSalon, './src/uuids.json');
    });

    Jennie.RunUserInteraction("reopen_button", [] /*Roles*/, async (interaction) => {
        const [uuid, nomeEnquete, member, messageid] = uuidSalon.get(interaction.channelId);

        console.log(messageid, "Affaire Open")

        if (uuid) {
            interaction.channel.setParent("1097563731602448574").then(() => {
                const content = '## **Cette affaire est classée**';
                const buttonLabel = "Fermer l'enquête";

                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId('reclose_button')
                        .setLabel(buttonLabel)
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(false),
                );

                if (messageid) {
                    interaction.channel.messages.fetch(messageid).then(message => {
                        message.delete()
                            .then(async () => {
                                const reply = await interaction.reply({
                                    "embeds": [
                                        {
                                            "type": "rich",
                                            "title": `Nom de l'enquete : ${nomeEnquete}`,
                                            "description": `Cette affaire a été **réouverte** le **${new Date(interaction.createdTimestamp).toLocaleDateString('fr') + " à " + new Date(interaction.createdTimestamp).toLocaleTimeString('fr')}** par **${interaction.member.nickname}**`,
                                            "color": 0x3b8a91,
                                            "author": {
                                                "name": `Federal Bureau of Investigation`,
                                                "url": `https://i.imgur.com/ykbsULq.png`
                                            },
                                            "thumbnail": {
                                                "url": `https://i.imgur.com/ykbsULq.png`,
                                                "height": 0,
                                                "width": 0
                                            },
                                            "footer": {
                                                "text": `Federal Bureau of Investigation`,
                                                "icon_url": `https://i.imgur.com/ykbsULq.png`
                                            }
                                        }
                                    ], components: [row], fetchReply: true
                                })

                                uuidSalon.set(interaction.channelId, [uuid, nomeEnquete, interaction.member.nickname, reply.id]);
                            })
                            .catch(error => {
                                console.error("Une erreur s'est produite lors de la suppression du dernier message du bot :", error);
                            });
                    })
                        .catch(error => {
                            console.error("Une erreur s'est produite lors de la récupération du dernier message du bot :", error);
                        });
                } else {
                    const reply = interaction.reply({
                        "embeds": [
                            {
                                "type": "rich",
                                "title": `Nom de l'enquete : ${nomeEnquete}`,
                                "description": `Cette affaire a été **réouverte** le **${new Date(interaction.createdTimestamp).toLocaleDateString('fr') + " à " + new Date(interaction.createdTimestamp).toLocaleTimeString('fr')}** par **${interaction.member.nickname}**`,
                                "color": 0x3b8a91,
                                "author": {
                                    "name": `Federal Bureau of Investigation`,
                                    "url": `https://i.imgur.com/ykbsULq.png`
                                },
                                "thumbnail": {
                                    "url": `https://i.imgur.com/ykbsULq.png`,
                                    "height": 0,
                                    "width": 0
                                },
                                "footer": {
                                    "text": `Federal Bureau of Investigation`,
                                    "icon_url": `https://i.imgur.com/ykbsULq.png`
                                }
                            }
                        ], components: [row], fetchReply: true
                    })

                    uuidSalon.set(interaction.channelId, [uuid, nomeEnquete, interaction.member.nickname, reply.id]);
                }
            })
        } else {
            interaction.reply({ content: "Impossible de classée cette affaire", ephemeral: true })
        }

        saveMapToFile(uuidSalon, './src/uuids.json');
    });
};

function saveMapToFile(map, filePath) {
    const serializedMap = JSON.stringify([...map]);
    fs.writeFileSync(filePath, serializedMap);
}

function loadMapFromFile(filePath) {
    if (fs.existsSync(filePath)) {
        const serializedMap = fs.readFileSync(filePath, 'utf8');
        const mapData = JSON.parse(serializedMap);
        return new Map(mapData);
    }
    return new Map();
}
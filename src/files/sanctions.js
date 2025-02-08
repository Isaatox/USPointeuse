const { Client, GatewayIntentBits, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, InteractionType } = require("discord.js");

module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("Avertissement orale", ["862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            interaction.client.targetUser = interaction.targetUser
            interaction.client.typesanction = interaction.commandName

            const modal = new ModalBuilder()
                .setCustomId('addsanction')
                .setTitle(interaction.commandName);

            const Justification = new TextInputBuilder()
                .setCustomId('justi')
                .setLabel("Raison")
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(Justification);


            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        } catch (error) {
            console.log("Liste Sanction : " + error)
        }
    });

    Jennie.RunUserInteraction('Avertissement écrit', ["862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            interaction.client.targetUser = interaction.targetUser
            interaction.client.typesanction = interaction.commandName

            const modal = new ModalBuilder()
                .setCustomId('addsanction')
                .setTitle(interaction.commandName);

            const Justification = new TextInputBuilder()
                .setCustomId('justi')
                .setLabel("Raison")
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(Justification);


            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        } catch (error) {
            console.log("Liste Sanction : " + error)
        }
    });

    Jennie.RunUserInteraction('Licenciement / Démission', ["862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            interaction.client.targetUser = interaction.targetUser
            interaction.client.typesanction = interaction.commandName

            const modal = new ModalBuilder()
                .setCustomId('addsanction')
                .setTitle(interaction.commandName);

            const Justification = new TextInputBuilder()
                .setCustomId('justi')
                .setLabel("Raison")
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(Justification);


            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
        } catch (error) {
            console.log("Liste Sanction : " + error)
        }
    });

    Jennie.RunUserInteraction("Voir les sanctions", ["473181497763823616", "862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            await database.query(`SELECT * FROM sanctions WHERE iddiscord = '${interaction.targetUser.id}';`, async function (err, result) {
                if (result.rows.length > 0) {
                    try {
                        var addscts = JSON.parse(result.rows[0].sanctions)
                        if (!interaction.replied) {
                            await interaction.reply({
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `Sanctions de ${interaction.targetUser.username}`,
                                        "description": `⬇️Vous pouvez retrouver ci-dessous le nombre de sanctions ainsi que leurs motifs.⬇️`,
                                        "fields": [
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Licenciement / Démission" }).length} Licenciement`,
                                                "value": `${addscts.map(licenciement).join("").replace(',', '')}`
                                            },
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Avertissement écrit" }).length} Avertissement écrit`,
                                                "value": `${addscts.map(ecrit).join("").replace(',', '')}`
                                            },
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Avertissement orale" }).length} Avertissement orale`,
                                                "value": `${addscts.map(oraux).join("").replace(',', '')}`
                                            }
                                        ],
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/6MI6USn.png`,
                                            "height": 0,
                                            "width": 0
                                        },
                                        "author": {
                                            "name": `Secrétaire Jennie`,
                                            "icon_url": `https://i.imgur.com/6MI6USn.png`
                                        },
                                        "footer": {
                                            "text": `US. Homeland Security`,
                                            "icon_url": `https://i.imgur.com/6MI6USn.png`
                                        },
                                        "color": 0x951d1d
                                    }
                                ], ephemeral: true
                            });
                        } else {
                            await interaction.editReply({
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `Sanctions de ${interaction.targetUser.username}`,
                                        "description": `⬇️Vous pouvez retrouver ci-dessous le nombre de sanctions ainsi que leurs motifs.⬇️`,
                                        "fields": [
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Licenciement / Démission" }).length} Licenciement`,
                                                "value": `${addscts.map(licenciement).join("").replace(',', '')}`
                                            },
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Avertissement écrit" }).length} Avertissement écrit`,
                                                "value": `${addscts.map(ecrit).join("").replace(',', '')}`
                                            },
                                            {
                                                "name": `${addscts.filter(function (val) { return val.type === "Avertissement orale" }).length} Avertissement orale`,
                                                "value": `${addscts.map(oraux).join("").replace(',', '')}`
                                            }
                                        ],
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/6MI6USn.png`,
                                            "height": 0,
                                            "width": 0
                                        },
                                        "author": {
                                            "name": `Secrétaire Jennie`,
                                            "icon_url": `https://i.imgur.com/6MI6USn.png`
                                        },
                                        "footer": {
                                            "text": `US. Homeland Security`,
                                            "icon_url": `https://i.imgur.com/6MI6USn.png`
                                        },
                                        "color": 0x951d1d
                                    }
                                ], ephemeral: true
                            });
                        }
                    } catch (error) {
                        console.log("LenghtTDS Error SQL : " + error)
                    }
                } else {
                    try {
                        if (!interaction.replied) {
                            await interaction.reply({ content: "Aucune sanctions trouvées ❌", ephemeral: true });
                        } else {
                            await interaction.editReply({ content: "Aucune sanctions trouvées ❌", ephemeral: true });
                        }
                    } catch (error) {
                        console.log("Insert Sanction : " + error);
                    }
                }
            })
        } catch (error) {
            console.log("Voir les sanctions : " + error)
        }
    });

    Jennie.RunUserInteraction("addsanction", ["862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            const sanctions = []
            const agence = config.ChannelSanction[config.agence.find(roleId => client.guilds.cache.get(config.guildid).members.cache.get(interaction.client.targetUser.id).roles.cache.has(roleId))]
            const agencelogo = config.Logo[config.agence.find(roleId => client.guilds.cache.get(config.guildid).members.cache.get(interaction.client.targetUser.id).roles.cache.has(roleId))]

            console.log(`Une sanction à été ajoutée par ${interaction.member.nickname} à ${interaction.client.targetUser.id} pour ${interaction.client.typesanction} : ${interaction.fields.getTextInputValue('justi')}`)

            await database.query(`SELECT * FROM sanctions WHERE iddiscord = '${interaction.client.targetUser.id}';`, function (err, result) {
                if (result.rows.length > 0) {
                    try {
                        var addscts = JSON.parse(result.rows[0].sanctions)
                        addscts.push({ id: addscts.length, type: interaction.client.typesanction, motif: interaction.fields.getTextInputValue('justi'), date_heure: new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr'), superviseur: `<@!${interaction.member.id}>` })
                        database.query(`UPDATE sanctions SET sanctions = '${JSON.stringify(addscts)}' WHERE iddiscord = '${interaction.client.targetUser.id}'`, async function (err, result) {
                            try {
                                if (interaction.client.typesanction !== "Avertissement orale") {
                                    client.channels.cache.get(agence).send({
                                        "embeds": [
                                            {
                                                "type": "rich",
                                                "author": {
                                                    name: 'Secrétaire Jennie',
                                                    url: undefined,
                                                    icon_url: agencelogo.img
                                                },
                                                "description": `Type : ${interaction.client.typesanction}\nMatricule de l'agent : <@!${interaction.client.targetUser.id}>\nRaison : **${interaction.fields.getTextInputValue('justi')}**\nDate & Heure : **${new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr')}**\nDécideur : **Supervisors / C.O**`,
                                                "color": parseInt(agencelogo.color, 16),
                                                "thumbnail": {
                                                    "url": agencelogo.img,
                                                    "height": 0,
                                                    "width": 0
                                                },
                                                "footer": {
                                                    "text": "Réalisé le " + new Date().toLocaleDateString('fr'),
                                                    "icon_url": agencelogo.img
                                                },
                                            }
                                        ]
                                    });
                                }

                                if (interaction.client.targetUser.bot === false) {
                                    try {
                                        client.users.fetch(interaction.client.targetUser.id).then(dm => {
                                            dm.send({
                                                "embeds": [
                                                    {
                                                        "type": "rich",
                                                        "author": {
                                                            name: 'Secrétaire Jennie',
                                                            url: undefined,
                                                            icon_url: agencelogo.img
                                                        },
                                                        "description": `Type : ${interaction.client.typesanction}\nMatricule de l'agent : <@!${interaction.client.targetUser.id}>\nRaison : **${interaction.fields.getTextInputValue('justi')}**\nDate & Heure : **${new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr')}**\nDécideur : **Supervisors / C.O**`,
                                                        "color": parseInt(agencelogo.color, 16),
                                                        "thumbnail": {
                                                            "url": agencelogo.img,
                                                            "height": 0,
                                                            "width": 0
                                                        },
                                                        "footer": {
                                                            "text": "Réalisé le " + new Date().toLocaleDateString('fr'),
                                                            "icon_url": agencelogo.img
                                                        },
                                                    }
                                                ]
                                            }).catch(error => error.code === 50007 ? console.error(`L'utilisateur ${interaction.client.targetUser.username} n'autorise pas les dms`) : console.error("Code erreur dm" + error))
                                        })
                                    } catch (error) {
                                        console.log("Is Bot 2 : " + error)
                                    }
                                }

                                if (!interaction.replied) {
                                    await interaction.reply({ content: "La sanction est enregistrée ✅", ephemeral: true });
                                } else {
                                    await interaction.update({ content: "La sanction est enregistrée ✅", ephemeral: true });
                                }
                            } catch (error) {
                                console.log("Update Sanction : " + error);
                            }
                        });
                    } catch (error) {
                        console.log("LenghtTDS Error SQL : " + error)
                    }
                } else {
                    try {
                        sanctions.push({ id: 0, type: interaction.client.typesanction, motif: interaction.fields.getTextInputValue('justi'), date_heure: new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr'), superviseur: `<@!${interaction.member.id}>` })
                        database.query(`INSERT INTO sanctions (iddiscord, sanctions) VALUES ('${interaction.client.targetUser.id}', '${JSON.stringify(sanctions)}')`, async function (err, result) {
                            try {
                                if (interaction.client.typesanction !== "Avertissement orale") {
                                    client.channels.cache.get(agence).send({
                                        "embeds": [
                                            {
                                                "type": "rich",
                                                "author": {
                                                    name: 'Secrétaire Jennie',
                                                    url: undefined,
                                                    icon_url: agencelogo.img
                                                },
                                                "description": `Type : ${interaction.client.typesanction}\nMatricule de l'agent : <@!${interaction.client.targetUser.id}>\nRaison : **${interaction.fields.getTextInputValue('justi')}**\nDate & Heure : **${new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr')}**\nDécideur : **Supervisors / C.O**`,
                                                "color": parseInt(agencelogo.color, 16),
                                                "thumbnail": {
                                                    "url": agencelogo.img,
                                                    "height": 0,
                                                    "width": 0
                                                },
                                                "footer": {
                                                    "text": "Réalisé le " + new Date().toLocaleDateString('fr'),
                                                    "icon_url": agencelogo.img
                                                },
                                            }
                                        ]
                                    });
                                }

                                if (interaction.client.targetUser.bot === false) {
                                    try {
                                        client.users.fetch(interaction.client.targetUser.id).then(dm => {
                                            dm.send({
                                                "embeds": [
                                                    {
                                                        "type": "rich",
                                                        "author": {
                                                            name: 'Secrétaire Jennie',
                                                            url: undefined,
                                                            icon_url: agencelogo.img
                                                        },
                                                        "description": `Type : ${interaction.client.typesanction}\nMatricule de l'agent : <@!${interaction.client.targetUser.id}>\nRaison : **${interaction.fields.getTextInputValue('justi')}**\nDate & Heure : **${new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr')}**\nDécideur : **Supervisors / C.O**`,
                                                        "color": parseInt(agencelogo.color, 16),
                                                        "thumbnail": {
                                                            "url": agencelogo.img,
                                                            "height": 0,
                                                            "width": 0
                                                        },
                                                        "footer": {
                                                            "text": "Réalisé le " + new Date().toLocaleDateString('fr'),
                                                            "icon_url": agencelogo.img
                                                        },
                                                    }
                                                ]
                                            }).catch(error => error.code === 50007 ? console.error(`L'utilisateur ${interaction.client.targetUser.username} n'autorise pas les dms`) : console.error("Code erreur dm" + error))
                                        })
                                    } catch (error) {
                                        console.log("Is Bot 2 : " + error)
                                    }
                                }

                                if (!interaction.replied) {
                                    await interaction.reply({ content: "La sanction est enregistrée ✅", ephemeral: true });
                                } else {
                                    await interaction.update({ content: "La sanction est enregistrée ✅", ephemeral: true });
                                }
                            } catch (error) {
                                console.log("Insert Sanction : " + error);
                            }
                        });
                    } catch (error) {
                        console.log("LenghtTDS2 Error2 SQL2 : " + error)
                    }
                }
            })
        } catch (error) {
            console.log("Rapport envoyé : " + error)
        }
    });

    Jennie.RunUserInteraction("rmsanction", ["862971523929341962" /*Manager*/, "862970764433031168" /*Supervisor*/, "1117175502592032852" /*Deputy dir FIB */, "1097309478136860782" /*Dir FIB */, "1097309474332614676" /*Dir USMS */, "970452879167078430" /*Dir USSS */, "916974726696538142"/*Deputy Chief */, "829469778284380180" /*Ass Chief */, "829469776371646494" /*Chief */, "829469771833278534" /*Chief Office */] /*Roles*/, async (interaction) => {
        try {
            await database.query(`SELECT sanctions FROM sanctions WHERE iddiscord = '${interaction.options.data[0].user.id}';`, async function (err, result) {
                if (result.rows.length > 0) {
                    try {
                        var addscts = JSON.parse(result.rows[0].sanctions)


                        addscts.filter(function (val, index) {
                            if (val.id === parseInt(interaction.options.data[1].value)) {
                                try {
                                    addscts.splice(index, 1)
                                } catch (error) {
                                    console.log("Remove Index : " + error)
                                }
                            }
                        })

                        database.query(`UPDATE sanctions SET sanctions = '${JSON.stringify(addscts.map((obj, index) => { obj.id = index; return obj }))}' WHERE iddiscord = '${interaction.options.data[0].user.id}'`, async function (err, result) {
                            try {
                                await interaction.reply({ content: "La sanction est supprimée ❌", ephemeral: true });
                            } catch (error) {
                                console.log("Update RM Sanction : " + error);
                            }
                        });

                    } catch (error) {
                        console.log("ADD Error SQL : " + error)
                    }
                } else {
                    try {
                        if (!interaction.replied) {
                            await interaction.reply({ content: "Aucune sanctions trouvées ❌", ephemeral: true });
                        } else {
                            await interaction.editReply({ content: "Aucune sanctions trouvées ❌", ephemeral: true });
                        }
                    } catch (error) {
                        console.log("RM Sanction Else: " + error);
                    }
                }
            })
        } catch (error) {
            console.log("RM Sanction : " + error)
        }
    });
};

function oraux(item) {
    if (item.type === "Avertissement orale") {
        //ID : 0 | Type : ⚠️ test | Date : dimanche 1 janvier 2023 à 15:01 | Auteur : @[4-35] Ricky Moore

        return [`${"`(ID : " + item.id + ")`"} | ⚠️ ${item.motif} | ${item.date_heure} | ${item.superviseur}\n`];
    }
}

function ecrit(item) {
    if (item.type === "Avertissement écrit") {
        return [`${"`(ID : " + item.id + ")`"} | ⛔ ${item.motif} | ${item.date_heure} | ${item.superviseur}\n`];
    }
}

function licenciement(item) {
    if (item.type === "Licenciement / Démission") {
        return [`${"`(ID : " + item.id + ")`"} | ❌ ${item.motif} | ${item.date_heure} | ${item.superviseur}\n`];
    }
}
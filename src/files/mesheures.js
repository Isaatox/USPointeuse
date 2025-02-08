module.exports = async ({ client, Jennie, config, database }) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

    Jennie.RunUserInteraction("mesheures", [] /*Roles*/, async (interaction) => {
        try {
            let numeroDeLaSemaine = Jennie.getNumberOfWeek();

            database.query(`SELECT * FROM service_agents WHERE iddiscord = '${interaction.user.id}' and semaine = ${numeroDeLaSemaine};`, function (err, result) {
                try {
                    if (result.rows.length !== 0) {

                        let heuresParJours = {
                            Lundi: 0,
                            Mardi: 0,
                            Mercredi: 0,
                            Jeudi: 0,
                            Vendredi: 0,
                            Samedi: 0,
                            Dimanche: 0,
                        }

                        result.rows.forEach(item => {
                            let hourMinuteSecond = item.total.split(':');
                            let hour = parseInt(hourMinuteSecond[0])
                            let minute = parseInt(hourMinuteSecond[1])
                            let second = parseInt(hourMinuteSecond[2])
                            let totalMinute = (hour * 60) + minute + (second / 60);
                            heuresParJours[days[item.jour]] += totalMinute;
                        })

                        let description = "";
                        let field = [];
                        let totalHeureSemaine = 0;
                        let totalMinuteSemaine = 0;

                        for (let jour in heuresParJours) {
                            let minutes = heuresParJours[jour];
                            let hours = Math.floor(minutes / 60);
                            totalHeureSemaine += hours;
                            let remainingMinutes = Math.round(minutes % 60);
                            totalMinuteSemaine += remainingMinutes;
                            description += `**${jour}** : *${hours.toString().padStart(2, '0')}h${remainingMinutes.toString().padStart(2, '0')}*\n`;
                        }
                        // description += `Total heures de la semaine : ${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`;

                        field = [{
                            "name": "Total d'heures de cette semaine",
                            "value": `${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`,
                        }];

                        try {
                            interaction.reply({
                                ephemeral: true,
                                embeds: [{
                                    "type": "rich",
                                    "title": "Heures de la semaines " + Jennie.getNumberOfWeek(),
                                    "color": 15241498,
                                    "description": description,
                                    "thumbnail": {
                                        "url": "https://media.discordapp.net/attachments/725802927083618366/1062802362357514300/Alarm-Clock-PNG-Image.png"
                                    },
                                    "fields": field,
                                }],
                            })
                        } catch (error) {
                            console.log("Embed mesHeures Bug : " + error)
                        }
                    } else {
                        interaction.reply({ content: "Il n'y a pas de données de service pour cette semaine.", ephemeral: true });
                    };
                } catch (error) {
                    console.log("BDD QUERY mesHeures : " + error);
                }
            })
        } catch (error) {
            console.log("Commandes mesHeures : " + error)
        }
    });

    Jennie.RunUserInteraction("recupererheures", [] /*Roles*/, async (interaction) => {
        try {
            let agentId = interaction.options.data[0].value;

            let agentNickName = interaction.options.data[0].member.nickname;
            let agentUserName = interaction.options.data[0].member.user.username
            let title = null;

            let numeroDeLaSemaine = Jennie.getNumberOfWeek();

            if (agentNickName != null) {
                title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentNickName;
            } else {
                title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentUserName;
            }

            database.query(`SELECT * FROM service_agents WHERE iddiscord = '${agentId}' and semaine = ${numeroDeLaSemaine};`, function (err, result) {
                try {
                    if (result.rows.length !== 0) {

                        let heuresParJours = {
                            Lundi: 0,
                            Mardi: 0,
                            Mercredi: 0,
                            Jeudi: 0,
                            Vendredi: 0,
                            Samedi: 0,
                            Dimanche: 0,
                        }
                        let description = "";
                        let composant = [];
                        let field = [];
                        let totalHeureSemaine = 0;
                        let totalMinuteSemaine = 0;

                        result.rows.forEach(item => {
                            let hourMinuteSecond = item.total.split(':');
                            let hour = parseInt(hourMinuteSecond[0])
                            let minute = parseInt(hourMinuteSecond[1])
                            let second = parseInt(hourMinuteSecond[2])
                            let totalMinute = (hour * 60) + minute + (second / 60);
                            heuresParJours[days[item.jour]] += totalMinute;
                        })



                        for (let jour in heuresParJours) {
                            let minutes = heuresParJours[jour];
                            let hours = Math.floor(minutes / 60);
                            totalHeureSemaine += hours;
                            let remainingMinutes = Math.round(minutes % 60);
                            totalMinuteSemaine += remainingMinutes;
                            description += `**${jour}** : *${hours.toString().padStart(2, '0')}h${remainingMinutes.toString().padStart(2, '0')}*\n`;
                        }

                        field = [{
                            "name": "Total d'heures de cette semaine",
                            "value": `${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`,
                        }];

                        if (numeroDeLaSemaine <= 1) {
                            composant = [
                                new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setCustomId('semainemoin1')
                                        .setLabel('Semaine précédente')
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(true),
                                    new ButtonBuilder()
                                        .setCustomId('semaineplus1')
                                        .setLabel('Semaine suivante')
                                        .setStyle(ButtonStyle.Primary),
                                ),
                            ]
                        } else if (numeroDeLaSemaine >= Jennie.getNumberOfWeek()) {
                            composant = [
                                new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setCustomId('semainemoin1')
                                        .setLabel('Semaine précédente')
                                        .setStyle(ButtonStyle.Primary),
                                    new ButtonBuilder()
                                        .setCustomId('semaineplus1')
                                        .setLabel('Semaine suivante')
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(true),
                                ),
                            ]
                        } else {
                            composant = [
                                new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setCustomId('semainemoin1')
                                        .setLabel('Semaine précédente')
                                        .setStyle(ButtonStyle.Primary),
                                    new ButtonBuilder()
                                        .setCustomId('semaineplus1')
                                        .setLabel('Semaine suivante')
                                        .setStyle(ButtonStyle.Primary),
                                ),
                            ]
                        };

                        try {
                            interaction.reply({
                                ephemeral: true,
                                embeds: [{
                                    "type": "rich",
                                    "title": title,
                                    "color": 15241498,
                                    "description": description,
                                    "thumbnail": {
                                        "url": "https://media.discordapp.net/attachments/725802927083618366/1062802362357514300/Alarm-Clock-PNG-Image.png"
                                    },
                                    "fields": field,
                                }],
                                components: composant,
                            })
                        } catch (error) {
                            console.log("Embed 1 : " + error)
                        }
                        client.on('interactionCreate', [] /*Roles*/, async (interaction) => {
                            try {
                                if (interaction.isButton()) {
                                    if (interaction.customId === "semainemoin1") {
                                        numeroDeLaSemaine--;
                                        database.query(`SELECT * FROM service_agents WHERE iddiscord = '${agentId}' and semaine = ${numeroDeLaSemaine};`, function (err, result) {
                                            try {
                                                if (result.rows.length !== 0) {
                                                    let heuresParJours = {
                                                        Lundi: 0,
                                                        Mardi: 0,
                                                        Mercredi: 0,
                                                        Jeudi: 0,
                                                        Vendredi: 0,
                                                        Samedi: 0,
                                                        Dimanche: 0,
                                                    }
                                                    let description = "";
                                                    let composant = [];
                                                    let field = [];
                                                    let totalHeureSemaine = 0;
                                                    let totalMinuteSemaine = 0;

                                                    if (agentNickName != null) {
                                                        title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentNickName;
                                                    } else {
                                                        title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentUserName;
                                                    }

                                                    result.rows.forEach(item => {
                                                        let hourMinuteSecond = item.total.split(':');
                                                        let hour = parseInt(hourMinuteSecond[0])
                                                        let minute = parseInt(hourMinuteSecond[1])
                                                        let second = parseInt(hourMinuteSecond[2])
                                                        let totalMinute = (hour * 60) + minute + (second / 60);
                                                        heuresParJours[days[item.jour]] += totalMinute;
                                                    })

                                                    for (let jour in heuresParJours) {
                                                        let minutes = heuresParJours[jour];
                                                        let hours = Math.floor(minutes / 60);
                                                        totalHeureSemaine += hours;
                                                        let remainingMinutes = Math.round(minutes % 60);
                                                        totalMinuteSemaine += remainingMinutes;
                                                        description += `**${jour}** : *${hours.toString().padStart(2, '0')}h${remainingMinutes.toString().padStart(2, '0')}*\n`;
                                                    }
                                                    // description += `Total heures de la semaine : ${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`;

                                                    field = [{
                                                        "name": "Total d'heures de cette semaine",
                                                        "value": `${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`,
                                                    }];

                                                    if (numeroDeLaSemaine <= 1) {
                                                        composant = [
                                                            new ActionRowBuilder().setComponents(
                                                                new ButtonBuilder()
                                                                    .setCustomId('semainemoin1')
                                                                    .setLabel('Semaine précédente')
                                                                    .setStyle(ButtonStyle.Primary)
                                                                    .setDisabled(true),
                                                                new ButtonBuilder()
                                                                    .setCustomId('semaineplus1')
                                                                    .setLabel('Semaine suivante')
                                                                    .setStyle(ButtonStyle.Primary),
                                                            ),
                                                        ]
                                                    } else if (numeroDeLaSemaine >= Jennie.getNumberOfWeek()) {
                                                        composant = [
                                                            new ActionRowBuilder().setComponents(
                                                                new ButtonBuilder()
                                                                    .setCustomId('semainemoin1')
                                                                    .setLabel('Semaine précédente')
                                                                    .setStyle(ButtonStyle.Primary),
                                                                new ButtonBuilder()
                                                                    .setCustomId('semaineplus1')
                                                                    .setLabel('Semaine suivante')
                                                                    .setStyle(ButtonStyle.Primary)
                                                                    .setDisabled(true),
                                                            ),
                                                        ]
                                                    } else {
                                                        composant = [
                                                            new ActionRowBuilder().setComponents(
                                                                new ButtonBuilder()
                                                                    .setCustomId('semainemoin1')
                                                                    .setLabel('Semaine précédente')
                                                                    .setStyle(ButtonStyle.Primary),
                                                                new ButtonBuilder()
                                                                    .setCustomId('semaineplus1')
                                                                    .setLabel('Semaine suivante')
                                                                    .setStyle(ButtonStyle.Primary),
                                                            ),
                                                        ]
                                                    };

                                                    try {
                                                        interaction.update({
                                                            embeds: [{
                                                                "type": "rich",
                                                                "title": title,
                                                                "color": 15241498,
                                                                "description": description,
                                                                "thumbnail": {
                                                                    "url": "https://media.discordapp.net/attachments/725802927083618366/1062802362357514300/Alarm-Clock-PNG-Image.png"
                                                                },
                                                                "fields": field,
                                                            }],
                                                            components: composant,
                                                        })
                                                    } catch (error) {
                                                        console.log("Embed 2 : " + error)
                                                    }
                                                } else {
                                                    interaction.reply({ content: "Il n'y a pas de données de service pour cette semaine.", ephemeral: true });
                                                };
                                            } catch (error) {
                                                console.log("BDD Query 2 : " + error)
                                            }
                                        })
                                    } else if (interaction.customId === "semaineplus1") {
                                        try {
                                            numeroDeLaSemaine++;
                                            database.query(`SELECT * FROM service_agents WHERE iddiscord = '${agentId}' and semaine = ${numeroDeLaSemaine};`, function (err, result) {
                                                try {
                                                    if (result.rows.length !== 0) {
                                                        let heuresParJours = {
                                                            Lundi: 0,
                                                            Mardi: 0,
                                                            Mercredi: 0,
                                                            Jeudi: 0,
                                                            Vendredi: 0,
                                                            Samedi: 0,
                                                            Dimanche: 0,
                                                        }
                                                        let description = "";
                                                        let composant = [];
                                                        let field = [];
                                                        let totalHeureSemaine = 0;
                                                        let totalMinuteSemaine = 0;

                                                        if (agentNickName != null) {
                                                            title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentNickName;
                                                        } else {
                                                            title = "Heures de la semaines " + numeroDeLaSemaine + " pour " + agentUserName;
                                                        }

                                                        result.rows.forEach(item => {
                                                            let hourMinuteSecond = item.total.split(':');
                                                            let hour = parseInt(hourMinuteSecond[0])
                                                            let minute = parseInt(hourMinuteSecond[1])
                                                            let second = parseInt(hourMinuteSecond[2])
                                                            let totalMinute = (hour * 60) + minute + (second / 60);
                                                            heuresParJours[days[item.jour]] += totalMinute;
                                                        })

                                                        for (let jour in heuresParJours) {
                                                            let minutes = heuresParJours[jour];
                                                            let hours = Math.floor(minutes / 60);
                                                            totalHeureSemaine += hours;
                                                            let remainingMinutes = Math.round(minutes % 60);
                                                            totalMinuteSemaine += remainingMinutes;
                                                            description += `**${jour}** : *${hours.toString().padStart(2, '0')}h${remainingMinutes.toString().padStart(2, '0')}*\n`;
                                                        }
                                                        // description += `Total heures de la semaine : ${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`;

                                                        field = [{
                                                            "name": "Total d'heures de cette semaine",
                                                            "value": `${totalHeureSemaine} heures et ${totalMinuteSemaine} minutes`,
                                                        }];

                                                        if (numeroDeLaSemaine <= 1) {
                                                            composant = [
                                                                new ActionRowBuilder().setComponents(
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semainemoin1')
                                                                        .setLabel('Semaine précédente')
                                                                        .setStyle(ButtonStyle.Primary)
                                                                        .setDisabled(true),
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semaineplus1')
                                                                        .setLabel('Semaine suivante')
                                                                        .setStyle(ButtonStyle.Primary),
                                                                ),
                                                            ]
                                                        } else if (numeroDeLaSemaine >= Jennie.getNumberOfWeek()) {
                                                            composant = [
                                                                new ActionRowBuilder().setComponents(
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semainemoin1')
                                                                        .setLabel('Semaine précédente')
                                                                        .setStyle(ButtonStyle.Primary),
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semaineplus1')
                                                                        .setLabel('Semaine suivante')
                                                                        .setStyle(ButtonStyle.Primary)
                                                                        .setDisabled(true),
                                                                ),
                                                            ]
                                                        } else {
                                                            composant = [
                                                                new ActionRowBuilder().setComponents(
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semainemoin1')
                                                                        .setLabel('Semaine précédente')
                                                                        .setStyle(ButtonStyle.Primary),
                                                                    new ButtonBuilder()
                                                                        .setCustomId('semaineplus1')
                                                                        .setLabel('Semaine suivante')
                                                                        .setStyle(ButtonStyle.Primary),
                                                                ),
                                                            ]
                                                        };

                                                        try {
                                                            interaction.update({
                                                                embeds: [{
                                                                    "type": "rich",
                                                                    "title": title,
                                                                    "color": 15241498,
                                                                    "description": description,
                                                                    "thumbnail": {
                                                                        "url": "https://media.discordapp.net/attachments/725802927083618366/1062802362357514300/Alarm-Clock-PNG-Image.png"
                                                                    },
                                                                    "fields": field,
                                                                }],
                                                                components: composant,
                                                            })
                                                        } catch (error) {
                                                            console.log("Embed 3 : " + error)
                                                        }
                                                    } else {
                                                        interaction.reply({ content: "Il n'y a pas de données de service pour cette semaine.", ephemeral: true });
                                                    };
                                                } catch (error) {
                                                    console.log("Bdd Query 3 : " + error)
                                                }
                                            })
                                        } catch (error) {
                                            console.log("Bouton S+1 : " + error);
                                        }
                                    }
                                }
                            } catch (error) {
                                console.log("Bouton action : " + error)
                            }
                        })
                    } else {
                        interaction.reply({ content: "Il n'y a pas de données de service pour cette semaine.", ephemeral: true });
                    };
                } catch (error) {
                    console.log("Error 1 query BDD" + error)
                }
            });
        } catch (error) {
            console.log("Commande recupHeuresAgents : " + error)
        }
    });
};
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, PermissionsBitField } = require("discord.js");

const danger = {
    "aucun": "https://i.imgur.com/niJL5np.png",
    "legerement menace": "https://i.imgur.com/4dCJPFj.png",
    "menace": "https://i.imgur.com/dYaGLs5.png",
    "dcd": "https://i.imgur.com/Df6cRiQ.png",
};

const mairie = {
    "SA": "Gouvernement de S.A",
    "BC": "Chateau de Blaine County",
    "LS": "Chateau de Los Santos",
    "JO": "Judge's Office",
    "BDP": "Bureau du procureur",
    "Autres": "Citoyens de S.A",

    "Gouvernement de S.A": "<:Gouv:1020069170597085266>",
    "Chateau de Blaine County": "<:BC:1090718817639989340>",
    "Chateau de Los Santos": "<:LS:1090718772127600721>",
    "Judge's Office": "<:doj:1090718799403171840>",
    "Bureau du procureur": "<:doj:1090718799403171840>",
    "Citoyens de S.A": "<:Gouv:1020069170597085266>"
}

const mairielogo = {
    "Gouvernement de S.A": "https://i.imgur.com/RDiV7RC.png",
    "Chateau de Blaine County": "https://i.imgur.com/abqWrxI.png",
    "Chateau de Los Santos": "https://i.imgur.com/25nH4m5.png",
    "Judge's Office": "https://i.imgur.com/XAQFzlG.png",
    "Bureau du procureur": "https://i.imgur.com/XAQFzlG.png",
    "Citoyens de S.A": "https://i.imgur.com/RDiV7RC.png"
}

const commands = [
    { id: '1151521572184662098', name: 'apr' },
    { id: '1151521572184662100', name: 'modifinfosvips' },
];


async function InitializeVIPsListe(client, commands, newvalue) {
    const guild = await client.guilds.fetch("829469307518844950");
    const commandManager = guild.commands;

    for (const cmd of commands) {
        const command = await commandManager.fetch(cmd.id);
        const options = command.options;
        const vips = [];

        if (options[0].choices && Array.isArray(options[0].choices)) {
            options[0].choices.forEach(choice => {
                vips.push({ name: choice.name, value: choice.value });
            });
        }

        vips.push(newvalue);

        options[0].choices = vips

        await commandManager.edit(command, {
            options
        });
    }
}

async function ModifInitializeVIPsListe(client, commands, newvalue, valuevip) {
    const guild = await client.guilds.fetch("829469307518844950");
    const commandManager = guild.commands;

    for (const cmd of commands) {
        const command = await commandManager.fetch(cmd.id);
        const options = command.options;
        const vips = [];

        if (options[0].choices && Array.isArray(options[0].choices)) {
            options[0].choices.forEach(choice => {
                vips.push({ name: choice.name, value: choice.value });
            });
        }

        const objet = vips.find(item => item.value === valuevip);

        if (objet) {
            objet.name = newvalue;
        }

        options[0].choices = vips
        await commandManager.edit(command, {
            options
        });
    }
}

async function DeleteVIPsListe(client, commands, deletedValues) {
    const guild = await client.guilds.fetch("829469307518844950");
    const commandManager = guild.commands;

    for (const cmd of commands) {
        const command = await commandManager.fetch(cmd.id);
        const options = command.options;
        const vips = [];

        if (options[0].choices && Array.isArray(options[0].choices)) {
            options[0].choices.forEach(choice => {
                if (!deletedValues.includes(choice.value)) {
                    vips.push({ name: choice.name, value: choice.value });
                }
            });
        }

        options[0].choices = vips

        await commandManager.edit(command, {
            options
        });
    }
}

const nValeurVips = {};

module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("apr", [], async (interaction) => {
        try {
            await database.query(`SELECT * FROM apr WHERE value = $1`, [interaction.options.get('vips').value], (err, result) => {
                if (err) throw err;
                try {
                    nValeurVips[interaction.user.id] = 0
                    let images = JSON.parse(result.rows[0].domiciles);
                    var row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('image').setLabel("Voir l'image suivante").setStyle(ButtonStyle.Primary).setDisabled(images.length <= 1), new ButtonBuilder().setCustomId('image2').setLabel("Voir l'image précédante").setStyle(ButtonStyle.Primary).setDisabled(true))
                    var row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('supprimer').setLabel(`Supprimer ${result.rows[0].nom} ${result.rows[0].prenom} de la liste`).setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true), new ButtonBuilder().setCustomId('supdom').setLabel("Supprimer le domicile N°1").setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true))

                    const exampleEmbed = new EmbedBuilder()
                        .setColor(0xa1db72)
                        .setAuthor({ name: `${result.rows[0].nom} ${result.rows[0].prenom}`, iconURL: mairielogo[result.rows[0].job] })
                        .setThumbnail(result.rows[0].photo)
                        .addFields(
                            { name: 'APR', value: result.rows[0].apr, inline: true },
                            { name: 'Numéro de téléphone', value: result.rows[0].phone, inline: true },
                            { name: 'Appartenance', value: result.rows[0].job, inline: true },
                            { name: 'Fonction', value: result.rows[0].fonction, inline: true }
                        )
                        .setImage(images[0])
                        .setTimestamp()
                        .setFooter({ text: 'Level de risque', iconURL: danger[result.rows[0].danger] });

                    interaction.reply({ embeds: [exampleEmbed], components: [row, row2], ephemeral: true, fetchReply: true })

                    interaction.client.tablevip = result;
                    interaction.client.embedsvip = exampleEmbed;

                } catch (error) {
                    console.log("Voir le VIP 1 : " + error)
                }
            });
        } catch (error) {
            console.log("Voir le VIP 2 : " + error)
        }
    });

    Jennie.RunUserInteraction("ajoutapr", [], async (interaction) => {
        try {
            var domicilesvips = isURL(interaction.options.data[8].value) ? `["${interaction.options.data[8].value}"]` : `[]`
            var photovips = isURL(interaction.options.data[6].value) ? interaction.options.data[6].value : "https://i.imgur.com/OFOd03v.png"

            await database.query(`INSERT INTO apr (nom, prenom, phone, fonction, job, apr, photo, danger, domiciles, value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`, [
                interaction.options.data[0].value,
                interaction.options.data[1].value,
                interaction.options.data[2].value,
                interaction.options.data[3].value,
                mairie[interaction.options.data[4].value],
                `<@!${interaction.options.data[5].value}>`,
                photovips,
                interaction.options.data[7].value,
                domicilesvips,
                transformString(`${interaction.options.data[0].value} ${interaction.options.data[1].value}`)
            ], async function (err, result) {
                try {
                    console.log(err)
                    if (!err) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: `Le VIP ${interaction.options.data[0].value} ${interaction.options.data[1].value} vient d'etre enregistré`, ephemeral: true })
                        } else {
                            await interaction.editReply({ content: `Le VIP ${interaction.options.data[0].value} ${interaction.options.data[1].value} vient d'etre enregistré`, ephemeral: true })
                        }

                        client.channels.cache.get("1199062190053924884").send({
                            "content": `Ajout de __${result.rows[0].nom} ${result.rows[0].prenom}__ dans le dossier __APR__`,
                            "embeds": [
                                {
                                    "type": "rich",
                                    "title": `${result.rows[0].nom} ${result.rows[0].prenom}`,
                                    "description": "",
                                    "color": 0x4e837b,
                                    "fields": [
                                        {
                                            "name": `Agent de protection rapprochée`,
                                            "value": `${result.rows[0].apr}`,
                                            "inline": true
                                        },
                                        {
                                            "name": `Lieu de travail`,
                                            "value": `__${result.rows[0].job} ${mairie[result.rows[0].job]}__`,
                                            "inline": true
                                        },
                                        {
                                            "name": `Risque du danger`,
                                            "value": `__${result.rows[0].danger.charAt(0).toUpperCase() + result.rows[0].danger.slice(1)}__`,
                                            "inline": true
                                        }
                                    ],
                                    "thumbnail": {
                                        "url": `${photovips}`,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "author": {
                                        "name": `Mise à jour du dossier APR`
                                    }
                                }
                            ]
                        });
                        await InitializeVIPsListe(client, commands, { "name": `${interaction.options.data[0].value} ${interaction.options.data[1].value}`, "value": `${transformString(`${interaction.options.data[0].value} ${interaction.options.data[1].value}`)}` });
                    } else {
                        console.log(`PostGres ${err.stack.split('\n')[1].trim()} : ${err}`)
                    }
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            });
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });

    Jennie.RunUserInteraction("listevips", [], async (interaction) => {
        const listvipscmd = []
        try {
            await database.query(`SELECT * FROM apr WHERE sup = 0 AND danger != 'dcd';`, async function (err, res) {
                const result = res.rows
                if (err) throw err;
                if (result.length > 0) {
                    try {
                        for (var i = 0; i < result.length; i++) {
                            listvipscmd.push({ "id": `${result[i].id}`, "nom": `${result[i].nom} ${result[i].prenom}`, "job": `${result[i].job}`, "apr": result[i].apr, "phone": result[i].phone })
                        }
                        const listvipstrier = listvipscmd.reduce((acc, curr) => {
                            const job = curr.job;
                            if (!acc[job]) {
                                acc[job] = [];
                            }
                            acc[job].push(curr);
                            return acc;
                        }, {});
                        if (!interaction.replied) {
                            await interaction.reply({
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `<:Gouv:1020069170597085266>San Andreas`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Gouvernement de S.A"] !== undefined ? listvipstrier["Gouvernement de S.A"].length : 0}\n\n__<:Gouv:1020069170597085266>Gouvernement de S.A :__\n\n${listvipstrier["Gouvernement de S.A"] !== undefined ? listvipstrier["Gouvernement de S.A"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa1db72,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/RDiV7RC.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:LS:1090718772127600721>Los Santos`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Chateau de Los Santos"] !== undefined ? listvipstrier["Chateau de Los Santos"].length : 0}\n\n__<:LS:1090718772127600721>Chateau de Los Santos :__\n\n${listvipstrier["Chateau de Los Santos"] !== undefined ? listvipstrier["Chateau de Los Santos"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xe9eded,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/25nH4m5.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:BC:1090718817639989340>Blaine County`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Chateau de Blaine County"] !== undefined ? listvipstrier["Chateau de Blaine County"].length : 0}\n\n__<:BC:1090718817639989340>Chateau de Blaine County :__\n\n${listvipstrier["Chateau de Blaine County"] !== undefined ? listvipstrier["Chateau de Blaine County"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0x74603f,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/abqWrxI.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:doj:1090718799403171840>Judge's Office`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Judge's Office"] !== undefined ? listvipstrier["Judge's Office"].length : 0}\n\n__<:doj:1090718799403171840>Judge's Office :__\n\n${listvipstrier["Judge's Office"] !== undefined ? listvipstrier["Judge's Office"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa12929,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/XAQFzlG.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:doj:1090718799403171840>Bureau du procureur`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Bureau du procureur"] !== undefined ? listvipstrier["Bureau du procureur"].length : 0}\n\n__<:doj:1090718799403171840>Bureau du procureur :__\n\n${listvipstrier["Bureau du procureur"] !== undefined ? listvipstrier["Bureau du procureur"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa12929,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/XAQFzlG.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:Gouv:1020069170597085266>Citoyens de S.A`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Citoyens de S.A"] !== undefined ? listvipstrier["Citoyens de S.A"].length : 0}\n\n__<:Gouv:1020069170597085266>Citoyens de S.A :__\n\n${listvipstrier["Citoyens de S.A"] !== undefined ? listvipstrier["Citoyens de S.A"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa1db72,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/RDiV7RC.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    }
                                ], ephemeral: true
                            });
                        } else {
                            await interaction.editReply({
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `<:Gouv:1020069170597085266>San Andreas`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Gouvernement de S.A"] !== undefined ? listvipstrier["Gouvernement de S.A"].length : 0}\n\n__<:Gouv:1020069170597085266>Gouvernement de S.A :__\n\n${listvipstrier["Gouvernement de S.A"] !== undefined ? listvipstrier["Gouvernement de S.A"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa1db72,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/RDiV7RC.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:LS:1090718772127600721>Los Santos`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Chateau de Los Santos"] !== undefined ? listvipstrier["Chateau de Los Santos"].length : 0}\n\n__<:LS:1090718772127600721>Chateau de Los Santos :__\n\n${listvipstrier["Chateau de Los Santos"] !== undefined ? listvipstrier["Chateau de Los Santos"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xe9eded,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/25nH4m5.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:BC:1090718817639989340>Blaine County`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Chateau de Blaine County"] !== undefined ? listvipstrier["Chateau de Blaine County"].length : 0}\n\n__<:BC:1090718817639989340>Chateau de Blaine County :__\n\n${listvipstrier["Chateau de Blaine County"] !== undefined ? listvipstrier["Chateau de Blaine County"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0x74603f,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/abqWrxI.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:doj:1090718799403171840>Judge's Office`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Judge's Office"] !== undefined ? listvipstrier["Judge's Office"].length : 0}\n\n__<:doj:1090718799403171840>Judge's Office :__\n\n${listvipstrier["Judge's Office"] !== undefined ? listvipstrier["Judge's Office"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa12929,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/XAQFzlG.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:doj:1090718799403171840>Bureau du procureur`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Bureau du procureur"] !== undefined ? listvipstrier["Bureau du procureur"].length : 0}\n\n__<:doj:1090718799403171840>Bureau du procureur :__\n\n${listvipstrier["Bureau du procureur"] !== undefined ? listvipstrier["Bureau du procureur"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa12929,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/XAQFzlG.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    },
                                    {
                                        "type": "rich",
                                        "title": `<:Gouv:1020069170597085266>Citoyens de S.A`,
                                        "description": `Nombre de VIPs au total : ${listvipstrier["Citoyens de S.A"] !== undefined ? listvipstrier["Citoyens de S.A"].length : 0}\n\n__<:Gouv:1020069170597085266>Citoyens de S.A :__\n\n${listvipstrier["Citoyens de S.A"] !== undefined ? listvipstrier["Citoyens de S.A"].map(sa).join("").replace('undefined', '') : ""}`,
                                        "color": 0xa1db72,
                                        "thumbnail": {
                                            "url": `https://i.imgur.com/RDiV7RC.png`,
                                            "height": 0,
                                            "width": 0
                                        }
                                    }
                                ], ephemeral: true
                            });
                        }
                    } catch (error) {
                        console.log("Liste VIPs 2 : " + error)
                    }
                }
            })
        } catch (error) {
            console.log("Liste VIPs 1 : " + error)
        }
    });

    Jennie.RunUserInteraction("modifinfosvips", [], async (interaction) => {
        try {
            database.query(`SELECT * FROM apr WHERE value = '${interaction.options.data[0].value}'`, async function (err, result, fields) {
                if (err) throw err;

                const domiciles = JSON.parse(result.rows[0].domiciles);

                if (interaction.options.get('phone') !== null) {
                    var phone = interaction.options.get('phone').value
                } else {
                    var phone = result.rows[0].phone
                }

                if (interaction.options.get('fonction') !== null) {
                    var fonction = interaction.options.get('fonction').value
                } else {
                    var fonction = result.rows[0].fonction
                }

                if (interaction.options.get('mairie') !== null) {
                    var job = mairie[interaction.options.get('mairie').value]
                } else {
                    var job = result.rows[0].job
                }

                if (interaction.options.get('apr') !== null) {
                    var apr = interaction.options.get('apr').value
                } else {
                    var apr = result.rows[0].apr
                }

                if (interaction.options.get('photo') !== null) {
                    var photovips = isURL(interaction.options.get('photo').value) ? interaction.options.get('photo').value : result.rows[0].photo
                } else {
                    var photovips = result.rows[0].photo
                }

                if (interaction.options.get('danger') !== null) {
                    var danger = interaction.options.get('danger').value

                    await ModifInitializeVIPsListe(client, commands, `${result.rows[0].prenom} ${result.rows[0].nom} ${interaction.options.get('danger').value !== "dcd" ? "" : "(Décèdé)"}`, `${interaction.options.data[0].value}`);
                } else {
                    var danger = result.rows[0].danger
                }

                if (interaction.options.get('domicile') !== null && isURL(interaction.options.get('domicile').value)) {
                    domiciles.push(interaction.options.get('domicile').value);
                }

                var domicilesvips = domiciles.length > 0 ? domiciles : result.rows[0].domiciles;

                await database.query(`UPDATE apr SET phone = $1, fonction = $2, job = $3, apr = $4, photo = $5, danger = $6, domiciles = $7 WHERE value = $8;`, [phone, fonction, job, apr, photovips, danger, JSON.stringify(domiciles), interaction.options.data[0].value], async function (err, resultss) {
                    if (err) throw err;
                    try {

                        if (!interaction.replied) {
                            await interaction.reply({ content: `Les informations du VIP viennent d'être enregistrées`, ephemeral: true })
                        } else {
                            await interaction.editReply({ content: `Les informations du VIP viennent d'être enregistrées`, ephemeral: true })
                        }
                    } catch (error) {
                        console.log("Modif infos 1 : " + error);
                    }
                });

            });
        } catch (error) {
            console.log("Modif infos 2 : " + error);
        }
    });

    Jennie.RunUserInteraction("image", [], async (interaction) => {
        try {
            let result = interaction.client.tablevip
            let images = JSON.parse(result.rows[0].domiciles);
            let exampleEmbed = interaction.client.embedsvip

            nValeurVips[interaction.user.id]++
            var row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('image').setLabel("Voir l'image suivante").setStyle(ButtonStyle.Primary).setDisabled(Math.abs(images.length - nValeurVips[interaction.user.id]) <= 1), new ButtonBuilder().setCustomId('image2').setLabel("Voir l'image précédante").setStyle(ButtonStyle.Primary).setDisabled(nValeurVips[interaction.user.id] < 1))
            var row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('supprimer').setLabel(`Supprimer de la liste`).setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true), new ButtonBuilder().setCustomId('supdom').setLabel("Supprimer le domicile N°" + Math.abs(nValeurVips[interaction.user.id] + 1)).setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true))
            const updatedEmbed = exampleEmbed.setImage(images[nValeurVips[interaction.user.id]]);

            if (interaction.replied) {
                await interaction.reply({ embeds: [updatedEmbed], components: [row, row2], ephemeral: true });
            } else {
                await interaction.update({ embeds: [updatedEmbed], components: [row, row2], ephemeral: true })
            }
        } catch (error) {
            console.log("Image : " + error)
        }
    });

    Jennie.RunUserInteraction("image2", [], async (interaction) => {
        try {
            let result = interaction.client.tablevip
            let images = JSON.parse(result.rows[0].domiciles);
            let exampleEmbed = interaction.client.embedsvip

            nValeurVips[interaction.user.id]--
            var row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('image').setLabel("Voir l'image suivante").setStyle(ButtonStyle.Primary).setDisabled(Math.abs(images.length - nValeurVips[interaction.user.id]) <= 1), new ButtonBuilder().setCustomId('image2').setLabel("Voir l'image précédante").setStyle(ButtonStyle.Primary).setDisabled(nValeurVips[interaction.user.id] < 1))
            var row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('supprimer').setLabel(`Supprimer de la liste`).setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true), new ButtonBuilder().setCustomId('supdom').setLabel("Supprimer le domicile N°" + Math.abs(nValeurVips[interaction.user.id] + 1)).setStyle(ButtonStyle.Danger).setDisabled(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) ? false : true || interaction.member.roles.cache.some(r => config.RoleAutoriseAPR.includes(r.id)) ? false : true))
            const updatedEmbed = exampleEmbed.setImage(images[nValeurVips[interaction.user.id]]);
            if (interaction.replied) {
                await interaction.reply({ embeds: [updatedEmbed], components: [row, row2], ephemeral: true });
            } else {
                await interaction.update({ embeds: [updatedEmbed], components: [row, row2], ephemeral: true });
            }
        } catch (error) {
            console.error("ajoutapr : " + error)
        }
    });

    Jennie.RunUserInteraction("supprimer", [], async (interaction) => {
        try {
            let result = interaction.client.tablevip
            let images = JSON.parse(result.rows[0].domiciles);
            let exampleEmbed = interaction.client.embedsvip

            await database.query(`UPDATE apr SET sup = $1 WHERE value = $2`, [1, result.rows[0].value], async function (err, result1) {
                if (err) throw err;

                if (interaction.replied) {
                    await interaction.update({ content: "Le VIP vient d'etre supprimé de la liste", ephemeral: true })
                } else {
                    await interaction.reply({ content: "Le VIP vient d'etre supprimé de la liste", ephemeral: true })
                }

                DeleteVIPsListe(client, commands, [result.rows[0].value]);
            });
        } catch (error) {
            console.log("Supprimer le VIP : " + error)
        }
    });

    Jennie.RunUserInteraction("supdom", [], async (interaction) => {
        try {
            let result = interaction.client.tablevip
            let images = JSON.parse(result.rows[0].domiciles);
            let exampleEmbed = interaction.client.embedsvip
            images.splice(nValeurVips[interaction.user.id], 1)

            await database.query(`UPDATE apr SET domiciles = $1 WHERE value = $2`, [JSON.stringify(images), result.rows[0].value], async function (err, result) {
                if (err) throw err;

                if (interaction.replied) {
                    await interaction.edit({ content: "Le domicile N°" + nValeurVips[interaction.user.id] + 1 + " vient d'etre supprimé de la liste", ephemeral: true })
                } else {
                    await interaction.reply({ content: "Le domicile N°" + nValeurVips[interaction.user.id] + 1 + " vient d'etre supprimé de la liste", ephemeral: true })
                }
            });
        } catch (error) {
            console.log("Supprimer le domicile : " + error)
        }
    });
};

function transformString(str) {
    str = str.toLowerCase();
    str = str.replace(/\s+/g, '_');
    return str;
}

function isURL(str) {
    const pattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return pattern.test(str);
}

function sa(item) {
    return [`(ID : ${item.id}) - ${mairie[item.job]} **${item.nom}** | **${item.phone}** | __Agent titulaire :__ ${item.apr}\n`];
}
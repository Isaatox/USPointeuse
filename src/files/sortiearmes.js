module.exports = async ({ client, Jennie, config }) => {
    Jennie.RunUserMessageChannel("1129441411666812928", [], async (message) => {
        try {
            if (!message.author.bot) {
                const embed = {
                    "components": [
                        {
                            "type": 1,
                            "components": [
                                {
                                    "style": 3,
                                    "label": `Rentrer ${message.content.substring(0, 70)}`,
                                    "custom_id": `sortie_arme`,
                                    "disabled": false,
                                    "type": 2
                                }
                            ]
                        }
                    ],
                    "embeds": [
                        {
                            "type": "rich",
                            "title": "",
                            "description": "",
                            "color": 0x386a9f,
                            "fields": [
                                {
                                    "name": `Matricule de l'agent :`,
                                    "value": "`" + message.member.nickname + "`"
                                },
                                {
                                    "name": `Type - Numéro d'arme :`,
                                    "value": "`" + message.content.substring(0, 70) + "`"
                                },
                                {
                                    "name": `Heure de sortie :`,
                                    "value": "`" + new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr') + "`",
                                    "inline": true
                                },
                                {
                                    "name": `Heure de rentrée :`,
                                    "value": "",
                                    "inline": true
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
                            }
                        }
                    ]
                };
    
                try {
                    await client.channels.cache.get(message.channelId).send(embed);
                    await message.delete();
                } catch (error) {
                    console.error(`Erreur lors de l'envoi ou de la suppression du message : ${error.stack.split('\n')[1].trim()} : ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`Erreur lors du traitement du message : ${error.stack.split('\n')[1].trim()} : ${error.message}`);
        }
    });
    

    Jennie.RunUserInteraction("sortie_arme", [] /*Roles*/, async (interaction) => {
        try {
            const channel = client.channels.cache.get(interaction.channelId);
            const msg = await channel.messages.fetch(interaction.message.id);
            
            if (!msg) return console.error(`Message inconnu : `);

            if (msg.author.id === config.clientid) {
                if (msg.editedTimestamp == null) {
                    try {
                        const embedJSON = msg.embeds[0].toJSON();
                        embedJSON.fields[3].value = "`" + new Date().toLocaleDateString('fr') + " à " + new Date().toLocaleTimeString('fr') + "`";
    
                        await msg.edit({ embeds: [embedJSON], components: [] });
                    } catch (error) {
                        console.error(`Erreur lors de l'édition du message : ${error.stack.split('\n')[1].trim()} : ${error.message}`);
                    }
                }
            }
        } catch (error) {
            console.error(`Erreur lors de la récupération ou de l'édition du message : ${error.stack.split('\n')[1].trim()} : ${error.message}`);
        }
    });
    
};

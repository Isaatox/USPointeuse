module.exports = async ({ client, Jennie, config }) => {
    Jennie.RunUserMessageChannel("1098215721936355389", [], async (message) => {
        try {
            if (!message.author.bot) {
                if (message.member.nickname) {
                    const regex = /^\d{1,2}-\d{1,2}$/;

                    if (regex.test(message.content)) {
                        const regex = new RegExp(`\\b${message.content}\\b`);
                        const isMatriculeTaken = message.guild.members.cache.some(({ nickname }) => {
                            const nicknameMatchesMatricule = nickname && regex.test(nickname) && !regex.test(message.member.nickname);

                            return nicknameMatchesMatricule;
                        });

                        if (isMatriculeTaken) {
                            message.delete().then((msg) => {
                                msg.channel.send(`Le matricule **${message.content}** est déjà pris`).then((msgdel) => {
                                    setTimeout(() => {
                                        msgdel.delete();
                                    }, 5000);
                                });
                            });
                        } else {
                            const role = config.agence.find(roleId => client.guilds.cache.get(config.guildid).members.cache.get(message.author.id).roles.cache.has(roleId));

                            message.delete().then((msg) => {
                                msg.channel.send({
                                    "embeds": [
                                        {
                                            "type": "rich",
                                            "title": "",
                                            "description": "",
                                            "color": 0xa3bdbd,
                                            "fields": [
                                                {
                                                    "name": `Nom - Prénom`,
                                                    "value": `${message.member.nickname.replace(/[^\wÀ-ÿ\s]/g, '').replace(/\d/g, '')}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": `Matricule`,
                                                    "value": `${message.content}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": `Service`,
                                                    "value": `${role !== undefined ? `<@&${role}>` : "Service inconnu"}`,
                                                    "inline": true
                                                }
                                            ],
                                            "author": {
                                                "name": `Secrétaire Jennie`,
                                                "icon_url": `https://i.imgur.com/NOt4qaB.png`
                                            },
                                            "footer": {
                                                "text": `Registre des matricules`,
                                                "icon_url": `https://i.imgur.com/NOt4qaB.png`
                                            }
                                        }
                                    ]
                                });
                            });

                            message.member.setNickname(`[${message.content}] ${message.member.nickname.replace(/[^\wÀ-ÿ\s]/g, '').replace(/\d/g, '')}`).then(() => {
                                console.log(`Changement du pseudo de \x1b[48;5;9m\x1b[30m${message.author.username}\x1b[0m suite à sa demande de matricule.`);
                            }).catch(error => {
                                console.error(`Erreur lors du changement de pseudo de ${message.author.username} : ${error}`);
                            });
                        }
                    } else {
                        message.delete().then((msg) => {
                            msg.channel.send('Veuillez inscrire le matricule sous ce format exemple : **4-77**').then((msgdel) => {
                                setTimeout(() => {
                                    msgdel.delete();
                                }, 5000);
                            });
                        });
                    }
                } else {
                    message.delete().then((msg) => {
                        console.log("Objet member : ",message.member)
                        msg.channel.send('Veuillez insérer votre nom avant de choisir un matricule').then((msgdel) => {
                            setTimeout(() => {
                                msgdel.delete();
                            }, 5000);
                        });
                    });
                }
            }
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : \x1b[41m\x1b[37m${error}`);
        }
    });
};

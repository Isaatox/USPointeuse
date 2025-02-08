const items = []

module.exports = async ({ client, Jennie, config, database }) => {
    Jennie.RunUserInteraction("findeservice", [] /*Roles*/, async (interaction) => {
        try {
            var hasRole = interaction.member.roles.cache.has(config.roleservice);

            if (hasRole && interaction.user.bot === false) {
                try {
                    var infosuser = Jennie.getinfosusers(items, interaction.member.id)

                    if (infosuser !== undefined) {
                        try {
                            database.query(`INSERT INTO service_agents (iddiscord, nickname, starttime, endtime, semaine, jour, total) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [infosuser.id, infosuser.user, infosuser.start, Date.now(), infosuser.semaine, infosuser.jour, Jennie.CalculePointeuseDuSerice(infosuser.start, Date.now())], (err, result) => {
                                if (err) {
                                    console.log(`Prise de service : ${err}`);
                                }
                            })

                        } catch (error) {
                            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                        }
                    }
                    Jennie.removeItem(items, interaction.member.nickname)
                    return interaction.member.roles
                        .remove(config.roleservice)
                        .then((member) =>
                            interaction.reply({
                                content: `Vous venez de prendre votre fin de service`,
                                ephemeral: true,
                            })
                        )
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            }
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });

    Jennie.RunUserInteraction("service", [] /*Roles*/, async (interaction) => {
        try {
            var hasRole = interaction.member.roles.cache.has(config.roleservice);

            if (hasRole === false && interaction.user.bot === false) {
                try {
                    items.push({ "timestampstart": Date.now(), "user": interaction.member.nickname, "id": interaction.member.id, "semaine": Jennie.getNumberOfWeek(), "jour": new Date().getDay() })

                    return interaction.member.roles
                        .add(config.roleservice)
                        .then((member) =>
                            interaction.reply({
                                content: `Vous venez de prendre votre service`,
                                ephemeral: true,
                            })
                        )
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            }
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });
};
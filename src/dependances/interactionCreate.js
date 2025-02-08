const Jennie = {};
Jennie.interactionsHandlers = {};
Jennie.messagesHandlers = {};
Jennie.messagesEditHandlers = {};
Jennie.salonsHandlers = {};

Jennie.RunUserInteraction = async function (commandName, requiredRoles, callback) {
    Jennie.interactionsHandlers[commandName] = async function (interaction) {
        const userRoles = interaction.member?.roles.cache.map(role => role.id) || [];

        if (requiredRoles.length === 0) {
            await callback(interaction);
        } else {
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            const hasRequiredUserId = requiredRoles.includes(interaction.user.id);

            if (hasRequiredRole || hasRequiredUserId) {
                await callback(interaction);
            } else {
                interaction.reply({ content: "Vous n'avez pas l'un des rôles requis.", ephemeral: true });
            }
        }
    };
};

Jennie.RunUserMessageChannel = async function (commandName, blacklistMots, callback) {
    Jennie.messagesHandlers[commandName] = async function (message) {
        if (blacklistMots.length === 0) {
            await callback(message);
        } else {
            const containsBlacklistedWord = blacklistMots.some(word => message.content.toLowerCase().includes(word));

            if (containsBlacklistedWord) {
                await callback(message);
            }
        }
    };
}

Jennie.RunUserMessageEditChannel = async function (commandName, blacklistMots, callback) {
    Jennie.messagesEditHandlers[commandName] = async function (message) {
        if (blacklistMots.length === 0) {
            await callback(message);
        } else {
            const containsBlacklistedWord = blacklistMots.some(word => message.content.toLowerCase().includes(word));

            if (containsBlacklistedWord) {
                await callback(message);
            }
        }
    };
}

Jennie.RunChannelCreate = async function (commandName, callback) {
    Jennie.salonsHandlers[commandName] = callback;
}

Jennie.CalculePointeuseDuSerice = (t1, t2) => {
    try {
        const diff = Math.max(t1, t2) - Math.min(t1, t2)
        const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN

        const hrs = Math.floor(diff / HRS)
        const min = Math.floor((diff % HRS) / MIN).toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
        const sec = Math.floor((diff % MIN) / SEC).toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
        const ms = Math.floor(diff % SEC).toLocaleString('fr-FR', { minimumIntegerDigits: 4, useGrouping: false })

        return `${hrs}:${min}:${sec}`
    } catch (error) {
        console.error("Erreur fonction calcul pointeuse du service : " + error)
    }
}

Jennie.removeItem = (items, item) => {
    try {
        for (var i in items) {
            if (items[i].user == item) {
                try {
                    items.splice(i, 1);
                    break;
                } catch (error) {
                    console.error("Erreur item.splice : " + error)
                }
            }
        }
    } catch (error) {
        console.error("Erreur remove item : " + error)
    }
}

Jennie.getinfosusers = (items, item) => {
    try {
        for (var i in items) {
            try {
                if (items[i].id == item) {
                    try {
                        return { "user": items[i].user, "id": items[i].id, "start": items[i].timestampstart, "semaine": items[i].semaine, "jour": items[i].jour };
                    } catch (error) {
                        console.error("Erreur return item : " + error)
                    }
                }
            } catch (error) {
                console.error("Erreur i in items : " + error)
            }
        }
    } catch (error) {
        console.error("Erreur get info user : " + error)
    }
}

Jennie.getNumberOfWeek = () => {
    try {
        var currentDate = new Date();
        var startDate = new Date(currentDate.getFullYear(), 0, 1);
        var days = Math.floor((currentDate - startDate) /
            (24 * 60 * 60 * 1000));

        return Math.ceil(days / 7);
    } catch (error) {
        console.error("Erreur getNumberOfWeek : " + error)
    }
}

Jennie.Colors = (...args) => {
    const lastArgument = args[args.length - 1];
    const color = {
        reset: "\x1b[0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m",
    };

    const validTextColors = lastArgument.map(colorName => color[colorName] || color.reset);
    const textColorCode = validTextColors.join('');
    const textToLog = args.slice(0, args.length - 1).join(' ');

    return `${textColorCode}${textToLog}${color.reset}`
}


module.exports = Jennie;
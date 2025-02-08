module.exports = async ({ client, Jennie, config }) => {
    Jennie.RunUserMessageChannel(config.ChannelMedia, [], async (message) => {
        try {
            if (message.attachments.size < 1 && message.content.length > 0 && !message.author.bot) {
                await message.delete();
            }
        } catch (error) {
            if (error.code === 10008) {
                console.warn(`Tentative de suppression d'un message déjà supprimé ou inexistant.`);
            } else {
                console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
            }
        }
    });

    Jennie.RunUserMessageEditChannel(config.ChannelMedia, [], async (message) => {
        try {
            if (message.attachments.size < 1 && message.content.length > 0 && !message.author.bot) {
                await message.delete();
            }
        } catch (error) {
            if (error.code === 10008) {
                console.warn(`Tentative de suppression d'un message déjà supprimé ou inexistant.`);
            } else {
                console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
            }
        }
    });
};

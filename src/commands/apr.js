const { fetchListVips } = require('../dependances/vips.js');

async function obtenirListeVips() {
    try {
        return {
            options: [
                {
                    type: 3,
                    name: 'vips',
                    description: 'Nom du VIPs',
                    required: true,
                    choices: await fetchListVips(),
                }
            ],
            name: 'apr',
            name_localizations: undefined,
            description: "Voir les infos d'un VIPs",
            description_localizations: undefined,
            default_permission: undefined,
            default_member_permissions: undefined,
            dm_permission: undefined
        };
    } catch (error) {
        console.error('Erreur lors du chargement de listvips :', error);
        return [];
    }
}

module.exports = obtenirListeVips();

const { fetchListVips } = require('../dependances/vips.js');

async function obtenirListeVips() {
    try {
        return {
            options: [
                {
                    type: 3,
                    name: 'vips',
                    description: 'Nom du VIP',
                    required: true,
                    choices: await fetchListVips(),
                }, {
                    type: 3,
                    name: 'phone',
                    description: 'Numéro de téléphone',
                    required: false,
                }, {
                    type: 3,
                    name: 'fonction',
                    description: 'Fonction du VIP',
                    required: false,
                }, {
                    type: 3,
                    name: 'mairie',
                    description: 'Appartient à quelles mairies ?',
                    required: false,
                    choices: [
                        { "name": `Gouvernement`, "value": `SA` },
                        { "name": `Mairie de Blaine County`, "value": `BC` },
                        { "name": `Mairie de Los Santos`, "value": `LS` },
                        { "name": `Judge's Office`, "value": `JO` },
                        { "name": `Bureau du procureur`, "value": `BDP` },
                        { "name": `Autres`, "value": `Autres` },
                    ],
                }, {
                    type: 6,
                    name: 'apr',
                    description: 'Agent titulaire',
                    required: false,
                }, {
                    type: 3,
                    name: 'photo',
                    description: 'Photo du VIP',
                    required: false,
                }, {
                    type: 3,
                    name: 'danger',
                    description: 'Niveau de menace du VIP',
                    required: false,
                    choices: [
                        { "name": `Protection sans risque aucune menace`, "value": `aucun` },
                        { "name": `Protection légèrement risqué potentiel menace sur vip`, "value": `legerement menace` },
                        { "name": `Protection risqué VIP menacé`, "value": `menace` },
                        { "name": `Décédé`, "value": `dcd` },
                    ],
                }, {
                    type: 3,
                    name: 'domicile',
                    description: 'Ajouter seulement 1 domicile si plusieurs puis effecter /adddomicile',
                    required: false,
                },
            ],
            name: 'modifinfosvips',
            name_localizations: undefined,
            description: "Modifier les informations d'un VIP",
            description_localizations: undefined,
            default_permission: undefined,
            default_member_permissions: undefined,
            dm_permission: undefined
        }
    } catch (error) {
        console.error('Erreur lors du chargement de listvips :', error);
        return [];
    }
}

module.exports = obtenirListeVips();
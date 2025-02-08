module.exports = {
    options: [
        {
            type: 3,
            name: 'choix',
            description: 'Choisissez la division',
            required: true,
            choices: [
                {
                    "name": "Emergency Response Team",
                    "value": "Emergency Response Team",
                    "inline": true
                },
                {
                    "name": "Fast Response Bureau",
                    "value": "Fast Response Bureau",
                    "inline": true
                },
                {
                    "name": "Communication",
                    "value": "Communication",
                    "inline": true
                },
                {
                    "name": "Hostage Rescue Team",
                    "value": "Hostage Rescue Team",
                    "inline": true
                },
                {
                    "name": "Air Unit",
                    "value": "Air Unit",
                    "inline": true
                },
                {
                    "name": "Médical Unit",
                    "value": "Médical Unit",
                    "inline": true
                },
                {
                    "name": "Special Operations Group",
                    "value": "Special Operations Group",
                    "inline": true
                },
                {
                    "name": "K9 Explosive Detection",
                    "value": "K9 Explosive Detection",
                    "inline": true
                },
                {
                    "name": "Academy",
                    "value": "Academy",
                    "inline": true
                },
                {
                    "name": "Réserve OP",
                    "value": "Réserve OP",
                    "inline": true
                },
                {
                    "name": "Patriotism and Immigration Authority",
                    "value": "Patriotism and Immigration Authority",
                    "inline": true
                }
            ]
        },
        {
            type: 3,
            name: 'etat',
            description: 'ON / OFF',
            required: true,
            choices: [
                { "name": `ON`, "value": `1` },
                { "name": `OFF`, "value": `0` },
            ],
        },
    ],
    name: 'divisions',
    name_localizations: undefined,
    description: "Ouverture des recrutements des divisions",
    description_localizations: undefined,
    default_permission: undefined,
    default_member_permissions: undefined,
    dm_permission: undefined
}
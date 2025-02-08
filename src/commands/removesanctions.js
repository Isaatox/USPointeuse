module.exports = {
    options: [
      {
        name: 'agent',
        name_localizations: undefined,
        description: 'Voir les heure de cet agent',
        description_localizations: undefined,
        required: true,
        type: 6
      },
      {
        type: 3,
        name: 'id',
        description: 'ID de la sanction',
        required: true,
      }
    ],
      name: 'rmsanction',
      name_localizations: undefined,
      description: 'Retirer une sanction',
      description_localizations: undefined,
      default_permission: undefined,
      default_member_permissions: undefined,
      dm_permission: undefined
}
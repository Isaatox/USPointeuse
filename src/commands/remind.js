module.exports = {
    options: [
      {
        type: 3,
        name: 'message',
        description: 'Message',
        required: true,
      },
      {
        type: 3,
        name: 'temps',
        description: 'Temps du rappel',
        required: true,
      }
    ],
      name: 'remind',
      name_localizations: undefined,
      description: "Rappel d'un message",
      description_localizations: undefined,
      default_permission: undefined,
      default_member_permissions: undefined,
      dm_permission: undefined
  }
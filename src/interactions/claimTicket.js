const { ButtonInteraction, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'claim_ticket',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(client, config, interaction) {
    try {
      await interaction.deferReply({});
      if (interaction.user.id == interaction.channel.topic) {
        await interaction.editReply({ content: 'يمكن استخدام هذا الزر من قبل طاقم التذاكر فقط.', ephemeral: true });
        return;
      }
      // Update the channel's permission overwrites
      await interaction.channel.permissionOverwrites.set([
        {
          id: interaction.guildId,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: interaction.channel.topic,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ]);
      interaction.message.components[0].components[1].data.disabled = true;
      interaction.message.edit({ components: interaction.message.components });
      // Respond to the claim interaction
      await interaction.editReply({
        content: `**تم استلام التذكرة**\nهذه التذكرة قد تم استلامها الآن بواسطة <@${interaction.user.id}>.`,
      });
    } catch (error) {
      await interaction.editReply({ content: 'حدث خطأ أثناء استلام هذه التذكرة.', ephemeral: true });
    }
  },
};

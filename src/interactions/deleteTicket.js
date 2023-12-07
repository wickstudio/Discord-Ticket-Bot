const { ButtonInteraction } = require('discord.js');

module.exports = {
  name: 'delete_ticket',
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(client, config, interaction) {
    try {
      // Confirm deletion with a response
      await interaction.reply({ content: '**سيتم حذف التذكرة خلال 5 ثواني**', ephemeral: true });

      // Delete the ticket channel after a short delay (optional)
      setTimeout(() => interaction.channel.delete(), 5000); // 5-second delay before deletion
    } catch (error) {
      await interaction.editReply({ content: 'حدث خطأ أثناء حذف التذكرة!', ephemeral: true });
    }
  },
};

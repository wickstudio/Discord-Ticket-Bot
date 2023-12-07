module.exports = {
    name: 'interactionCreate',
    async execute(client, config, interaction) {
        if (interaction.isCommand()) {
            const commandsRunner = client.commands.get(interaction.commandName);
            commandsRunner.execute(client, config, interaction);
        }
        if (!interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return;

        const interactionRun = client.interactions.get(interaction.customId.split('*')[0]);
        if (interactionRun) interactionRun.execute(client, config, interaction);
    },
};

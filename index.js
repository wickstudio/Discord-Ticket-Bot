const {
  Client,
  GatewayIntentBits,
  Collection,
  Routes,
  REST,
} = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
const fs = require("fs");
var http = require("http");
http
  .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
  })
  .listen(8080);
const config = require("./config.json");

client.commands = new Collection();
client.interactions = new Collection();
const commands = [];

// Load commands
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.name, command);
  commands.push(command.data);
}

// Load interactions
const interactionsFiles = fs
  .readdirSync("./src/interactions")
  .filter((file) => file.endsWith(".js"));
for (const file of interactionsFiles) {
  const interaction = require(`./src/interactions/${file}`);
  client.interactions.set(interaction.name, interaction);
}

// Load events
const eventsFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventsFiles) {
  const event = require(`./src/events/${file}`);
  client.on(event.name, async (...args) => {
    event.execute(client, config, ...args);
  });
}
const rest = new REST().setToken(process.env.TOKEN);

client.once("ready", async () => {
  await rest.put(Routes.applicationCommands(client.user.id), {
    body: commands,
  });
  console.log(`Bot is online! ${client.user.username}`);
  console.log("Code by Wick Studio");
  console.log("discord.gg/wicks");
});

client.login(process.env.TOKEN);

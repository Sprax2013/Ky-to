module.exports = (client, message) => {
    // Ignores BotZ
    if (message.author.bot) return;
  ​
    // Ignore Messages without Prefix
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  ​
    // standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  ​
    // Grabs  Command from client.commands endmap
    const cmd = client.commands.get(command);
  ​
    // No Command? No Problem! This does the Exist c:
    if (!cmd) return;
  ​
    // Commandos Runnus
    cmd.run(client, message, args);
  };

  // https://anidiots.guide/first-bot/a-basic-command-handler
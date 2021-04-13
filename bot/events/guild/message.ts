import { PREFIX } from "../../constants";
import commands from "../../commands/commands.json";
import { commandType } from "bot/types";

module.exports = async (Discord: any, client: any, message: any) => {
  try {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    const [cmd, ...args] = message.content
      .trim()
      .slice(PREFIX.length)
      .split(/\s+/);

    Object.keys(commands).forEach((key: string) => {
      const thisCmd: commandType = commands[key];

      if (thisCmd.name === cmd) return message.reply(thisCmd.reply);
    });

    const command = client.commands.get(cmd.toLowerCase());
    if (command) command.execute(client, message, args, Discord);
  } catch (err) {
    message.reply("An error occured");
  }
};

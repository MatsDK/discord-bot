import { PREFIX } from "../../constants";
import commands from "../../commands/commands.json";
import { commandType } from "bot/types";

export default async (Discord: any, client: any, message: any) => {
  if (message.author.bot) return;
  try {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    const [cmd, ...args] = message.content
      .trim()
      .slice(PREFIX.length)
      .split(/\s+/);

    Object.keys(commands).forEach((key: string) => {
      const thisCmd: commandType = commands[key];

      if (thisCmd.keyword === cmd)
        if (thisCmd.action) {
          const command = client.commands.get(cmd.toLowerCase());
          if (command) return command.execute(client, message, args, Discord);
        } else return message.reply(thisCmd.reply);
      //
    });
  } catch (err) {
    message.reply("An error occured");
  }
};

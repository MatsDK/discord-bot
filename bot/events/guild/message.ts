import { prefixState } from "../../constants";
import commands from "../../commands/commands.json";
import { commandType } from "bot/types";

export default async (Discord: any, client: any, message: any) => {
  if (message.author.bot) return;
  try {
    if (
      !message.content
        .toLowerCase()
        .startsWith(prefixState.PREFIX.toLowerCase()) ||
      message.author.bot
    )
      return;

    const [cmd, ...args] = message.content
      .trim()
      .slice(prefixState.PREFIX.length)
      .split(/\s+/);

    console.log(client.commands);
    Object.keys(commands).forEach((key: string) => {
      const thisCmd: commandType = commands[key];

      if (thisCmd.keyword.toLowerCase() === cmd.toLowerCase()) {
        if (
          !thisCmd.channels.allChannels &&
          !thisCmd.channels.allowedChannels.includes(message.channel.id)
        )
          return message.reply("This Command can't be used in this channel");

        if (
          !thisCmd.roles.allRoles &&
          !message.member.roles.cache.some((role: any) =>
            thisCmd.roles.consentedRoles.includes(role.id)
          )
        )
          return message.reply("You don't have the permissions");

        if (thisCmd.action) {
          const command = client.commands.get(cmd.toLowerCase());

          if (command) return command.execute(client, message, args);
        } else return message.reply(thisCmd.reply);
      }
    });
  } catch (err) {
    message.reply("An error occured");
  }
};

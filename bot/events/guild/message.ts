import { prefixState } from "../../constants";

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

    const thisCmd: any = client.commands.get(cmd.toLowerCase());
    if (!thisCmd) return;

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

    if (thisCmd.action) thisCmd.execute(client, message, args);
    else message.reply(thisCmd.reply);
  } catch (err) {
    message.reply("An error occured");
  }
};

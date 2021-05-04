import { clientState } from "../../client";
import { ignoredChannelsState, prefixState } from "../../constants";
import conf from "../../conf.json";

export default async (Discord: any, client: any, message: any) => {
  if (message.author.bot) return;
  try {
    if (
      !message.member._roles.includes(conf.modeRoleId) &&
      ignoredChannelsState.IGNORED_CHANNELS.includes(
        message.channel.id as never
      )
    )
      return;

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

    const thisCmd: any = clientState.client.commands.get(cmd.toLowerCase());
    if (!thisCmd) return;

    if (
      !thisCmd.channels.allChannels &&
      !thisCmd.channels.allowedChannels.includes(message.channel.id)
    )
      return message.reply("This Command cannot be used in this channel");

    if (
      !thisCmd.roles.allRoles &&
      !message.member.roles.cache.some((role: any) =>
        thisCmd.roles.consentedRoles.includes(role.id)
      )
    )
      return message.reply("You don't have the permissions");

    if (thisCmd.action) thisCmd.execute(clientState.client, message, args);
    else message.reply(thisCmd.reply);
  } catch (err) {
    console.log(err);
    message.reply("An error occured");
  }
};

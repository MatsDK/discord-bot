import { clientState } from "../../client";
import { clientGuildObj, commandType } from "../../types";

export default async (Discord: any, client: any, message: any) => {
  if (message.author.bot) return;
  try {
    const thisGuildCommands: Map<
        string,
        commandType
      > = clientState.client.guildCommands.get(message.guild.id),
      thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
        message.guild.id
      );
    console.log(thisGuildObj);
    if (!thisGuildCommands || !thisGuildObj) return;

    if (
      !message.member._roles.some((_: string) =>
        thisGuildObj.modeRolesIds.includes(_)
      ) &&
      thisGuildObj.ignoredChannels.includes(message.channel.id as never)
    )
      return;

    if (
      !message.content
        .toLowerCase()
        .trim()
        .startsWith(thisGuildObj.prefix.toLowerCase()) ||
      message.author.bot
    )
      return;

    const [cmd, ...args] = message.content
      .trim()
      .slice(thisGuildObj.prefix.length)
      .split(/\s+/);

    const thisCmd: any = thisGuildCommands.get(cmd.toLowerCase());
    if (!thisCmd) return;

    // FIX TYPO IN DATABASE
    if (
      !thisCmd.channels.allChannles &&
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

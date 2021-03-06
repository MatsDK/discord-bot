import { clientGuildObj, commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { clientState } from "../../bot/client";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const target = message.mentions.members.first();
          if (!target)
            return message.reply("Please mention the user you want to unmute");

          if (target.id == message.author.id)
            return message.reply("You can't unmute yourself");

          if (!message.member.hasPermission("MUTE_MEMBERS"))
            return message.reply(
              "You don't have enough permissions to use this command"
            );

          const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
            message.guild.id
          );
          if (!thisGuildObj) return;

          const mutedRole = message.guild.roles.cache.find(
            (role: any) => role.id === thisGuildObj.mutedRoleId
          );
          if (!mutedRole)
            message.reply("There is no Muted role on this server");

          const memberRole = message.guild.roles.cache.find(
            (role: any) => role.id === thisGuildObj.memberRoleId
          );
          if (!memberRole)
            message.reply("There is no Member role on this server");

          if (!target.roles.cache.has(mutedRole.id))
            return message.reply("Member is not muted");

          target.roles.remove(mutedRole);
          target.roles.add(memberRole);

          message.reply(`You unmuted ${target.user} `);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}

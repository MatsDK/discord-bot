import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

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

          const mutedRole = message.guild.roles.cache.find(
            (role: any) => role.name === "Muted"
          );
          if (!mutedRole)
            message.reply("There is no Muted role on this server");

          const memberRole = message.guild.roles.cache.find(
            (role: any) => role.name === "Member"
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

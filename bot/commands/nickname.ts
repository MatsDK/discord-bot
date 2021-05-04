import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const target = message.mentions.members.first();
          if (!target) return message.reply("You need to mention a person");

          if (message.member.id === target.id)
            return message.reply("You can't give yourself a nickname");

          if (!message.member.hasPermission("MANAGE_NICKNAMES"))
            return message.reply(
              "You don't have permissions to change nicknames"
            );
          if (!message.guild.me.hasPermission("MANAGE_NICKNAMES"))
            return message.reply(
              "I don't have permissions to change nicknames"
            );
          if (!target.kickable)
            return message.reply(
              "I cannot change that member's nickname as their role is higher then mine"
            );

          const newNickName: string = args.slice(1).join(" ").trim();
          if (!args.slice(1).length || !newNickName.length)
            return message.reply("Please provide your new nickname");

          await target.setNickname(newNickName).catch((err: any) => {
            console.log(err);
          });
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}

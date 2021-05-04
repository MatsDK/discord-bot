import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const formatRolesMessage = (roles: any) => {
            return Array.from(roles)
              .sort((a: any, b: any) => b[1].rawPosition - a[1].rawPosition)
              .map(([key, _]: any) => _.name)
              .map((role: string) => `-${role}`)
              .join(`\n`);
          };

          const target = message.mentions.members.first();

          if (!target)
            return message.channel.send(
              `\n${formatRolesMessage(message.guild.roles.cache)}`
            );
          else
            return message.channel.send(
              `\n${formatRolesMessage(target.roles.cache)}`
            );
        } catch (err) {
          message.reply("An error");
        }
      }
    );
  }
}

import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const targetNameInput: string = args.join(" ").toLowerCase().trim();
          if (!targetNameInput.length)
            return message.reply("Please mention a role");

          const targetRole =
            message.mentions.roles.first() ||
            message.guild.roles.cache.find(
              (_: any) =>
                _.name.toLowerCase() === targetNameInput ||
                _.id === targetNameInput
            );
          if (!targetRole) return message.reply("Role not found");

          targetRole
            .setMentionable(!targetRole.mentionable)
            .then((res: any) => {
              message.channel.send(
                `Mentioning **${res.name}** is set to: ${res.mentionable}`
              );
            });
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

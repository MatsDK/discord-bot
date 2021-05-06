import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const thisGuildCommands = client.guildCommands.get(message.guild.id);
          if (!thisGuildCommands) return;

          const returnCommands = (commands: Array<commandType>) => {
            message.channel.send(
              commands.map(
                (_: commandType) =>
                  `-**${_.keyword}**${_.description && ", " + _.description}`
              )
            );
          };

          const roleName: string = args.join(" ")?.trim();
          if (roleName.length) {
            const targetRole =
              message.mentions.roles.first() ||
              message.guild.roles.cache.find(
                (_: any) =>
                  _.name.toLowerCase() === roleName.toLowerCase() ||
                  _.id == roleName.toLowerCase()
              );
            if (!targetRole) return message.reply("Role not found");

            const commands: any[] = Array.from(
              thisGuildCommands
                .filter(
                  (cmd: any) =>
                    cmd.roles.allRoles ||
                    cmd.roles.consentedRoles.includes(targetRole.id)
                )
                .entries()
            ).map(([keyword, _]: any) => _);

            returnCommands(commands);
          } else {
            const commands: any[] = Array.from(thisGuildCommands.entries())
              .filter(
                ([key, _]: any) =>
                  _.roles.allRoles ||
                  _.roles.consentedRoles.some(
                    (role: any) => !!message.member.roles.cache.get(role)
                  )
              )
              .map(([keyword, _]: any) => _);

            returnCommands(commands);
          }
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

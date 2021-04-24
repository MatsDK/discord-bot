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
          if (!target) return message.reply("Please mention a user");

          if (target.id === message.author.id)
            return message.reply("You can't role yourself");

          if (!args[1])
            return message.reply("Please provide a role name or id");

          const roles: string[] = args
            .slice(1)
            .map((_: string) => _.toLowerCase());
          const newRole = message.guild.roles.cache.filter(
            (_: any) =>
              roles.includes(_.name.toLowerCase()) ||
              roles.includes(_.id.toLowerCase())
          );

          if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.reply("You don't have permissions to give roles");

          const changed: { added: Array<string>; removed: Array<string> } = {
            added: [],
            removed: [],
          };

          for (let idx in Array.from(newRole.entries())) {
            const [_, role]: any = Array.from(newRole.entries())[idx];

            if (
              target.roles.cache.some(
                (_: any) =>
                  _.name.toLowerCase() === role.name.toLowerCase() ||
                  _.id.toLowerCase() === role.name.toLowerCase()
              )
            ) {
              await target.roles.remove(role);
              changed.removed.push(role.name);
            } else {
              await target.roles.add(role);
              changed.added.push(role.name);
            }
          }
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}

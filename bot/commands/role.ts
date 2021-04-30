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
          if (!target) return message.reply("Please mention a user");

          if (target.id === message.author.id)
            return message.reply("You can't role yourself");

          if (!args[1])
            return message.reply("Please provide a role name or id");

          const roles: string[] = args
            .slice(1)
            .map((_: string) => _.toLowerCase());
          const newRoles = message.guild.roles.cache.filter(
            (_: any) =>
              roles.includes(_.name.toLowerCase()) ||
              roles.includes(_.id.toLowerCase())
          );

          for (let [key, mentionedRole] of message.mentions.roles)
            newRoles.set(key, mentionedRole);

          if (!message.member.hasPermission("MANAGE_ROLES"))
            return message.reply("You don't have permissions to give roles");

          const changed: { added: Array<string>; removed: Array<string> } = {
            added: [],
            removed: [],
          };

          for (let idx in Array.from(newRoles.entries())) {
            const [_, role]: any = Array.from(newRoles.entries())[idx];

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
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          if (args[0]?.trim().toLowerCase() === "clear") {
            if (!message.member.hasPermission("MANAGE_ROLES"))
              return message.reply(
                "You don't have persmission to remove roles"
              );

            if (!message.guild.me.hasPermission("MANAGE_ROLES"))
              return message.reply("I don't have permission to remove roles");

            if (!args.slice(1).length)
              return message.reply("Please mention roles you want to clear");

            const roles: string[] = args.slice(1);
            const targetRoles = [
              ...Array.from(message.mentions.roles).map(
                ([key, role]: any) => role
              ),
              ...Array.from(
                message.guild.roles.cache.filter((_: any) =>
                  roles.includes(_.id.trim())
                )
              ).map(([key, role]: any) => role),
            ].map((_: any) => _.id);

            const members = await message.guild.members.fetch(),
              targetMembers = members.filter((_: any) =>
                targetRoles.some((role) => _._roles.includes(role))
              );

            for (let targetMember of targetMembers) {
              let member = targetMember[1];
              member.roles.remove(targetRoles).catch((err: any) => {
                console.log(err);
                return;
              });
            }
          } else {
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
          }
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

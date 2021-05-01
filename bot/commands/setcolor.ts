import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          if (!args[0] || args.length < 2)
            return message.reply(
              "Please mention a role or it's id and a hex color"
            );

          const targetRole =
            message.mentions.roles.first() ||
            message.guild.roles.cache.find((_: any) => _.id == args[0]?.trim());
          if (!targetRole) return message.reply("Role not found");

          args = args.slice(1, args.length);
          const hexColor = new RegExp(/^#([0-9A-F]{3}){1,2}$/i);
          if (!args[0]?.trim().startsWith("#")) args[0] = "#" + args[0].trim();

          if (!hexColor.test(args[0].trim()))
            return message.reply(`${args[0]} isn't a valid color`);

          targetRole
            .setColor(args[0].trim())
            .then((updated: any) =>
              message.reply(
                `Color of role **${targetRole.name}** is set to: **${updated.hexColor}**`
              )
            )
            .catch(() => message.reply("Can't update the color"));
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

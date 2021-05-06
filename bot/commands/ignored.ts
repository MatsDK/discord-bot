import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { ignoredChannelsState, ignoredUsersState } from "../states";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const members = await message.guild.members.fetch();

          message.channel.send(
            `**Ignored channels**: \n${ignoredChannelsState.IGNORED_CHANNELS.map(
              (_: string) =>
                message.guild.channels.cache.find(
                  (channel: any) => channel.id === _
                )
            )
              .filter((_) => _)
              .map((_: any) => `<#${_.id}>`)
              .slice(0, 90)
              .join(
                ", "
              )}\n**Igored users**: \n${ignoredUsersState.IGNORED_USERS.map(
              (_: string) => members.find((member: any) => member.id === _)
            )
              .filter((_: any) => _)
              .map((_: any) => `<@${_.id}>`)
              .slice(0, 90)
              .join(", ")}`
          );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

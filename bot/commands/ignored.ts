import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { ignoredChannelsState } from "../constants";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          message.channel.send(
            `**Ignored channels**: \n${ignoredChannelsState.IGNORED_CHANNELS.map(
              (_: string) =>
                message.guild.channels.cache.find(
                  (channel: any) => channel.id === _
                )
            )
              .filter((_) => _)
              .map((_: any) => `-<#${_.id}>`)
              .join("\n")}`
          );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

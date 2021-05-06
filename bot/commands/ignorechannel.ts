import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { ignoredChannelsState } from "../states";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const targetChannelsIds: Set<string> = new Set([
            ...args
              .map((_: string) =>
                message.guild.channels.cache.find(
                  (role: any) => role.id === _.trim()
                )
              )
              .filter((_) => _)
              .map((_: any) => _.id),
            ...Array.from(message.mentions.channels).map(
              ([key, _]: any) => _.id
            ),
          ]);
          if (!targetChannelsIds.size)
            return message.reply("Please mention channels you want to ignore");

          const newIgnoredChannels: string[] =
            ignoredChannelsState.IGNORED_CHANNELS;
          const filterArr: string[] = [];

          Array.from(targetChannelsIds).forEach((_: string) => {
            if (!ignoredChannelsState.IGNORED_CHANNELS.includes(_ as never))
              newIgnoredChannels.push(_);
            else filterArr.push(_);
          });

          ignoredChannelsState.setIgnoredChannels(
            newIgnoredChannels.filter((_: string) => !filterArr.includes(_))
          );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

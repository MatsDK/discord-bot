import { clientGuildObj, commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { setIgnoredUsers } from "../states";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const thisGuildObj: clientGuildObj = client.guildObjs.get(
            message.guild.id
          );
          if (!thisGuildObj) return;

          const members = await message.guild.members.fetch(),
            targetUsers: Set<string> = new Set([
              ...args
                .map((_: string) =>
                  members.find((role: any) => role.id === _.trim())
                )
                .filter((_) => _)
                .map((_: any) => _.id),
              ...Array.from(message.mentions.members).map(
                ([key, _]: any) => _.id
              ),
            ]);

          const newIgnoredUsers: string[] = thisGuildObj.ignoredUsers,
            filterArr: string[] = [];

          Array.from(targetUsers).forEach((_: string) => {
            if (!thisGuildObj.ignoredUsers.includes(_ as never))
              newIgnoredUsers.push(_);
            else filterArr.push(_);
          });

          setIgnoredUsers(
            message.guild.id,
            newIgnoredUsers.filter((_: string) => !filterArr.includes(_))
          );
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

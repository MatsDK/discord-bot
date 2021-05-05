import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import { ignoredUsersState } from "../../bot/constants";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
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

          const newIgnoredUsers: string[] = ignoredUsersState.IGNORED_USERS,
            filterArr: string[] = [];

          Array.from(targetUsers).forEach((_: string) => {
            if (!ignoredUsersState.IGNORED_USERS.includes(_ as never))
              newIgnoredUsers.push(_);
            else filterArr.push(_);
          });

          ignoredUsersState.setIgnoredUsers(
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

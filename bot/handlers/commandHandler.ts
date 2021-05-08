import { commandType, dbGuildType } from "../types";
import path from "path";
import generateGuildObj from "./helper";
import guildBot from "../../server/db/models/guildBot";

export const commandHandler = async (client: any, Discord: any) => {
  const dbGuilds = await guildBot.find();
  const guilds: any[] = Array.from(client.guilds.cache).map(
    ([key, _]: any) => _
  );

  guilds.forEach(async (_: any) => {
    const thisDbGuild: dbGuildType = await dbGuilds.find(
        (guild: dbGuildType) => guild.guildId === _.id
      ),
      thisClientMap: Map<string, commandType> = new Map();

    if (!thisDbGuild.isActive || !thisDbGuild.setup) return;

    const setCommands = new Promise((resolve, reject) => {
      const commandsArr: commandType[] = [
        ...thisDbGuild.commands,
        ...thisDbGuild.actions,
      ];

      commandsArr.forEach(async (cmd: commandType, idx: number) => {
        if (cmd.action) {
          const ext = process.env.__DEV__ == "true" ? ".ts" : ".js",
            { CommandConstructor } = await import(
              path.resolve(
                __dirname,
                `../commands/${path.basename(cmd.fileName || "", ".ts") + ext}`
              )
            ),
            { command }: { command: commandType } = new CommandConstructor(cmd);

          thisClientMap.set(cmd.keyword.toLowerCase(), command);
          //
        } else thisClientMap.set(cmd.keyword.toLowerCase(), cmd);

        if (idx + 1 >= commandsArr.length) resolve(thisClientMap);
      });
    });

    await setCommands.then((res) => {
      client.guildCommands.set(_.id, res);
    });

    client.guildObjs.set(thisDbGuild.guildId, generateGuildObj(thisDbGuild));
  });
};

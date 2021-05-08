import fs from "fs";
import Discord from "discord.js";
import path from "path";
import {
  ignoredChannelsState,
  ignoredUsersState,
  prefixState,
} from "../../bot/states";
import { Request, Response, Router } from "express";
import { commandType, createCmdBody } from "../../bot/types";
import { nanoid } from "nanoid";
import { clientState } from "../../bot/client";
import { getData } from "../utils/getData";
import { commandHandler } from "../../bot/handlers/commandHandler";
import guildBot from "../../server/db/models/guildBot";
import { cmdExists } from "../../server/utils/cmdExists";

const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const client = clientState.client;

  let thisGuildCommands: any = client.guildCommands.get(
    process.env.TMP_GUILD_ID
  );
  if (!thisGuildCommands) thisGuildCommands = [];

  const newGuildCommands = {};
  Array.from(thisGuildCommands).forEach(
    ([key, _]: any) => (newGuildCommands[key] = _)
  );

  const { channelsArr, rolesArr } = getData(
    process.env.TMP_GUILD_ID as string,
    client
  );
  res.json({
    err: false,
    data: {
      commands: newGuildCommands,
      prefix: prefixState.PREFIX,
      channels: channelsArr,
      roles: rolesArr,
    },
  });
});

router.get("/getData/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = clientState.client;
  const thisGuildCommands = client.guildCommands.get(process.env.TMP_GUILD_ID);
  if (!thisGuildCommands) return res.json({ err: "Command not found" });

  const thisCmd: commandType | undefined = Array.from(thisGuildCommands)
    .map(([key, _]: any) => _)
    .find((_: any) => _.id === id);
  if (!thisCmd) return res.json({ err: "Command not found" });

  const { channelsArr, rolesArr } = getData(
    process.env.TMP_GUILD_ID as string,
    client
  );
  res.json({
    err: false,
    data: {
      thisCmd,
      prefix: prefixState.PREFIX,
      channels: channelsArr,
      roles: rolesArr,
    },
  });
});

router.post("/createCmd", async (req: Request, res: Response) => {
  try {
    const { keyWord, description, reply, ...rest }: createCmdBody = req.body;
    const { channels, allChannels, roles, allRoles } = rest;

    const thisGuildCommands: Map<
      string,
      any
    > = clientState.client.guildCommands.get(process.env.TMP_GUILD_ID);
    if (!thisGuildCommands) return res.json({ err: "Server not found" });

    if (cmdExists(thisGuildCommands, keyWord))
      return res.json({ err: "Keyword is already used" });

    const newCmd: commandType = {
      keyword: keyWord,
      roles: {
        allRoles,
        consentedRoles: allRoles ? [] : roles,
      },
      channels: {
        allChannels,
        allowedChannels: allChannels ? [] : channels,
      },
      action: false,
      description,
      reply,
      id: nanoid(),
    };

    thisGuildCommands.set(newCmd.keyword.toLowerCase().toString(), newCmd);

    await guildBot.updateOne(
      {
        guildId: process.env.TMP_GUILD_ID,
      },
      { $push: { commands: newCmd } }
    );

    res.json({ err: false, data: thisGuildCommands });
  } catch (err) {
    res.json({ err: err.message });
  }
});

interface ChangeCommandBody {
  command: commandType;
}

router.post("/changeCmd", async (req: Request, res: Response) => {
  try {
    const {
      command: { id, action },
      command,
    }: ChangeCommandBody = req.body;
    if (!id) return res.json({ err: true });

    const thisGuildCommands: Map<
      string,
      any
    > = clientState.client.guildCommands.get(process.env.TMP_GUILD_ID);
    if (!thisGuildCommands) return res.json({ err: "Server not found" });

    if (!action) {
      let thisCmd = Array.from(thisGuildCommands)
        .map(([key, _]: any) => _)
        .find((_) => _.id === id);

      if (cmdExists(thisGuildCommands, command.keyword) && thisCmd.id !== id)
        return res.json({ err: "Keyword is already used" });

      if (thisCmd) {
        thisGuildCommands.delete(thisCmd.keyword);
        thisGuildCommands.set(command.keyword, command);

        guildBot.findOne(
          { guildId: process.env.TMP_GUILD_ID },
          async (err: any, guild: any) => {
            if (err) return res.json({ err: err.message });
            const idx: number = guild.commands.findIndex(
              (_: commandType) => _.id === id
            );

            if (idx) {
              guild.commands[idx] = command;
              await guild.save();
            }
          }
        );
      }

      // clientState.client.commands.clear();
      // commandHandler(clientState.client, Discord);
    } else {
      const { default: commandData } = await import(
        "../../bot/commands/actions.json"
      );

      const cmdId: string | undefined = Object.keys(commandData).find(
        (_: string) => _ === id
      );
      if (!cmdId) return res.json({ err: true });

      let thisCmd: commandType | undefined = commandData[cmdId];
      if (!thisCmd) return res.json({ err: true });

      command.fileName = thisCmd.fileName;
      commandData[id] = command;

      fs.writeFileSync(
        path.resolve(__dirname, "../../bot/commands/actions.json"),
        JSON.stringify(commandData),
        null
      );

      clientState.client.commands.clear();
      commandHandler(clientState.client, Discord);
    }

    res.json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: true });
  }
});

router.post("/setPrefix", (req: Request, res: Response) => {
  const { prefix } = req.body;
  if (!prefix) return res.json({ err: "Invalid prefix" });

  prefixState.setPrefix(prefix);
  res.json({ err: false });
});

router.get("/ignored", async (req: Request, res: Response) => {
  try {
    const guild = clientState.client.guilds.cache.first();
    let bannedMembers = await guild.fetchBans(),
      ignoredChannels: any[] = ignoredChannelsState.IGNORED_CHANNELS,
      ignoredUsers: any[] = ignoredUsersState.IGNORED_USERS;

    bannedMembers = Array.from(bannedMembers).map(([userId, _]: any) => {
      const { reason, user } = _;
      return { name: user.tag, id: userId, reason, img: user.avatarURL() };
    });

    ignoredChannels = ignoredChannels
      .map((_: string) =>
        guild.channels.cache.find((channel: any) => channel.id === _)
      )
      .filter((_: any) => _)
      .map((_: any) => ({ name: _.name, id: _.id }));

    const members = await guild.members.fetch();
    ignoredUsers = ignoredUsers
      .map((_: string) => members.find((member: any) => member.id === _))
      .filter((_: any) => _)
      .map((_: any) => ({ name: _.user.tag, id: _.id }));

    return res.json({
      err: false,
      ignoredChannels,
      bannedMembers,
      ignoredUsers,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
});

export default router;

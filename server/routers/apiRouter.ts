import { setPrefix } from "../../bot/states";
import { Request, Response, Router } from "express";
import { clientGuildObj, commandType, createCmdBody } from "../../bot/types";
import { nanoid } from "nanoid";
import { clientState } from "../../bot/client";
import { getData } from "../utils/getData";
import guildBot from "../../server/db/models/guildBot";
import { cmdExists } from "../../server/utils/cmdExists";

const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const client = clientState.client,
    guildId = req.query.guildId;

  let thisGuildCommands: any = client.guildCommands.get(guildId);
  if (!thisGuildCommands) thisGuildCommands = [];

  const thisGuildObj: clientGuildObj = client.guildObjs.get(guildId);
  if (!thisGuildObj) return res.json({ err: "Server not found" });

  const newGuildCommands = {};
  Array.from(thisGuildCommands).forEach(
    ([key, _]: any) => (newGuildCommands[key] = _)
  );

  const { channelsArr, rolesArr, data } = await getData(
    guildId as string,
    client
  );

  res.json({
    err: false,
    data: {
      commands: newGuildCommands,
      prefix: thisGuildObj.prefix,
      channels: channelsArr,
      roles: rolesArr,
      data,
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

  const thisGuildObj: clientGuildObj = client.guildObjs.get(
    process.env.TMP_GUILD_ID
  );
  if (!thisGuildObj) return res.json({ err: "Server not found" });

  const { channelsArr, rolesArr } = await getData(
    process.env.TMP_GUILD_ID as string,
    client
  );
  res.json({
    err: false,
    data: {
      thisCmd,
      prefix: thisGuildObj.prefix,
      channels: channelsArr,
      roles: rolesArr,
    },
  });
});

router.post("/createCmd", async (req: Request, res: Response) => {
  try {
    const { keyWord, description, reply, ...rest }: createCmdBody = req.body;
    const { channels, allChannels, roles, allRoles } = rest;

    const thisGuildCommands: Map<string, any> =
      clientState.client.guildCommands.get(process.env.TMP_GUILD_ID);
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

router.post("/changeCmd", async (req: Request, res: Response) => {
  try {
    const {
      command: { id, action },
      command,
    }: { command: commandType } = req.body;
    if (!id) return res.json({ err: true });

    const thisGuildCommands: Map<string, any> =
      clientState.client.guildCommands.get(process.env.TMP_GUILD_ID);
    if (!thisGuildCommands) return res.json({ err: "Server not found" });

    let thisCmd = Array.from(thisGuildCommands)
      .map(([key, _]: any) => _)
      .find((_) => _.id === id);

    if (cmdExists(thisGuildCommands, command.keyword) && thisCmd.id !== id)
      return res.json({ err: "Keyword is already used" });

    if (thisCmd) {
      thisGuildCommands.delete(thisCmd.keyword);
      thisGuildCommands.set(command.keyword, command);

      if (!action) {
        return guildBot.findOne(
          { guildId: process.env.TMP_GUILD_ID },
          async (err: any, guild: any) => {
            if (err) return res.json({ err: err.message });
            if (!guild) return res.json({ err: "Server not found" });

            const idx: number = guild.commands.findIndex(
              (_: commandType) => _.id === id
            );

            if (idx >= 0) {
              guild.commands[idx] = command;
              await guild.save();
              return res.json({ err: false });
            }
          }
        );
      } else {
        return guildBot.findOne(
          { guildId: process.env.TMP_GUILD_ID },
          async (err: any, guild: any) => {
            if (err) return res.json({ err: err.message });
            if (!guild) return res.json({ err: "Server not found" });

            const idx: number = guild.actions.findIndex(
              (_: commandType) => _.id === id
            );

            if (idx >= 0) {
              guild.actions[idx] = command;
              await guild.save();
              return res.json({ err: false });
            }
          }
        );
      }
    }

    res.json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: true });
  }
});

router.post("/setPrefix", async (req: Request, res: Response) => {
  try {
    const { prefix } = req.body;
    if (!prefix) return res.json({ err: "Invalid prefix" });

    const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
      process.env.TMP_GUILD_ID
    );
    if (!thisGuildObj) return res.json({ err: "server not found" });

    setPrefix(process.env.TMP_GUILD_ID as string, prefix);
    res.json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: err.message });
  }
});

router.get("/ignored", async (req: Request, res: Response) => {
  try {
    const guildId = req.query.guildId;
    if (!guildId) return res.json({ err: "can't find guild" });

    const guild = clientState.client.guilds.cache.get(guildId);
    if (!guild) return res.json({ err: "server not found" });

    const thisGuildObj: clientGuildObj =
      clientState.client.guildObjs.get(guildId);
    if (!thisGuildObj) return res.json({ err: "server not found" });

    let bannedMembers = await guild.fetchBans(),
      ignoredChannels: any[] = thisGuildObj.ignoredChannels,
      ignoredUsers: any[] = thisGuildObj.ignoredUsers;

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

    const { data } = await getData(guildId as string, clientState.client);

    return res.json({
      err: false,
      ignoredChannels,
      bannedMembers,
      ignoredUsers,
      guildData: data,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
});

export default router;

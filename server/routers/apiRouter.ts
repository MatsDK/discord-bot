import { setPrefix } from "../../bot/states";
import { Request, Response, Router } from "express";
import { clientGuildObj, commandType, createCmdBody } from "../../bot/types";
import { nanoid } from "nanoid";
import { clientState } from "../../bot/client";
import { getData } from "../utils/getData";
import guildBot from "../../server/db/models/guildBot";
import { cmdExists } from "../../server/utils/cmdExists";
import { getGuildObj } from "../../server/utils/getGuildObjs";
import {
  getIgnoredChannels,
  getBannedMembers,
  getIgnoredMembers,
  removeChannels,
  removeMembers,
  removeBanned,
} from "../../server/utils/ignore";

const router = Router();

router.get("/get  Data", async (req: Request, res: Response) => {
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

router.get("/getGuilds", async (req: Request, res: Response) => {
  const guilds = await getGuildObj(clientState.client);
  res.json({ guilds });
});

router.get("/getData/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { guildId } = req.query;
  const client = clientState.client;
  const thisGuildCommands = client.guildCommands.get(guildId);
  if (!thisGuildCommands) return res.json({ err: "Command not found" });

  const thisCmd: commandType | undefined = Array.from(thisGuildCommands)
    .map(([key, _]: any) => _)
    .find((_: any) => _.id === id);
  if (!thisCmd) return res.json({ err: "Command not found" });

  const thisGuildObj: clientGuildObj = client.guildObjs.get(guildId);
  if (!thisGuildObj) return res.json({ err: "Server not found" });

  const { channelsArr, rolesArr, data } = await getData(
    guildId as string,
    client
  );
  res.json({
    err: false,
    data: {
      thisCmd,
      prefix: thisGuildObj.prefix,
      channels: channelsArr,
      roles: rolesArr,
      guildData: data,
    },
  });
});

router.post("/createCmd", async (req: Request, res: Response) => {
  try {
    const { keyWord, description, reply, guildId, ...rest }: createCmdBody =
      req.body;
    const { channels, allChannels, roles, allRoles } = rest;

    const thisGuildCommands: Map<string, any> =
      clientState.client.guildCommands.get(guildId);
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
        guildId,
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
      guildId,
      command: { id, action },
      command,
    }: { guildId: string; command: commandType } = req.body;
    if (!id) return res.json({ err: true });

    const thisGuildCommands: Map<string, any> =
      clientState.client.guildCommands.get(guildId);
    if (!thisGuildCommands) return res.json({ err: "Server not found" });

    let thisCmd = Array.from(thisGuildCommands)
      .map(([key, _]: any) => _)
      .find((_) => _.id === id);

    if (cmdExists(thisGuildCommands, command.keyword) && thisCmd.id !== id)
      return res.json({ err: "Keyword is already used" });

    if (thisCmd) {
      thisGuildCommands.delete(thisCmd.keyword);
      thisGuildCommands.set(command.keyword, command);

      return guildBot.findOne({ guildId }, async (err: any, guild: any) => {
        if (err) return res.json({ err: err.message });
        if (!guild) return res.json({ err: "Server not found" });

        let idx: number;
        if (!action)
          idx = guild.commands.findIndex((_: commandType) => _.id === id);
        else idx = guild.actions.findIndex((_: commandType) => _.id === id);

        if (idx >= 0) {
          if (!action) guild.commands[idx] = command;
          else guild.actions[idx] = command;

          await guild.save();
          return res.json({ err: false });
        }
      });
    }

    res.json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: true });
  }
});

router.post("/setPrefix", async (req: Request, res: Response) => {
  try {
    const { prefix, guildId } = req.body;
    if (!prefix) return res.json({ err: "Invalid prefix" });

    const thisGuildObj: clientGuildObj =
      clientState.client.guildObjs.get(guildId);
    if (!thisGuildObj) return res.json({ err: "server not found" });

    setPrefix(guildId as string, prefix);
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

    bannedMembers = getBannedMembers(bannedMembers);
    ignoredChannels = getIgnoredChannels(thisGuildObj.ignoredChannels, guild);
    ignoredUsers = await getIgnoredMembers(thisGuildObj.ignoredUsers, guild);

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

type changeIgnoredBody = {
  removeIgnoredChannels: string[];
  removeIgnoredMembers: string[];
  removeBannedMembers: string[];
  guildId: string;
};

router.post("/changeIgnored", async (req: Request, res: Response) => {
  const {
    removeIgnoredChannels,
    removeIgnoredMembers,
    removeBannedMembers,
    guildId,
  }: changeIgnoredBody = req.body;

  const ignoredChannels: any = removeChannels(
    removeIgnoredChannels || [],
    guildId
  );
  if (ignoredChannels.err) return res.json({ err: ignoredChannels.err });

  const ignoredMembers: any = await removeMembers(
    removeIgnoredMembers || [],
    guildId
  );
  if (ignoredMembers.err) return res.json({ err: ignoredMembers.err });

  const bannedMembers: any = removeBanned(removeBannedMembers, guildId);
  if (bannedMembers.err) return res.json({ err: bannedMembers.err });

  res.json({ ignoredChannels, ignoredMembers, bannedMembers });
});

export default router;

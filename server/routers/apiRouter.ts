import { prefixState } from "../../bot/constants";
import { Request, Response, Router } from "express";
import { channelsType, commandType, createCmdBody, rolesType } from "bot/types";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { clientState } from "../../bot/client";

const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const { default: commands } = await import(
    "../../bot/commands/commands.json"
  );
  Object.keys(commands).forEach((key: string) => {
    commands[key].id = key;
  });

  const client = clientState.client;
  const channelsArr: channelsType[] = Array.from(
    client.channels.cache
      .filter((channel: any) => channel.type === "text")
      .entries()
  ).map(([_, value]: any) => ({ name: value.name, id: value.id }));

  const rolesArr: rolesType[] = Array.from(
    client.guilds.cache.first().roles.cache.entries()
  ).map(([_, value]: any) => ({
    id: value.id,
    name: value.name,
    color: value.color,
    rawPosition: value.rawPosition,
  }));

  res.json({
    err: false,
    data: {
      commands,
      prefix: prefixState.PREFIX,
      channels: channelsArr,
      roles: rolesArr,
    },
  });
});

router.post("/createCmd", async (req: Request, res: Response) => {
  const { keyWord, description, reply, ...rest }: createCmdBody = req.body;
  const { channels, allChannels, roles, allRoles } = rest;
  const { default: commands } = await import(
    "../../bot/commands/commands.json"
  );

  const cmds: commandType[] = Object.keys(commands).map((key: string) => {
    commands[key].id = key;
    return commands[key];
  });

  if (
    cmds.some(
      (_: commandType) => _.keyword.toLowerCase() === keyWord.toLowerCase()
    )
  )
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
  };

  commands[nanoid()] = newCmd;

  fs.writeFileSync(
    path.resolve(__dirname, "../../bot/commands/commands.json"),
    JSON.stringify(commands),
    null
  );

  Object.keys(commands).forEach((key: string) => {
    commands[key].id = key;
  });
  res.json({ err: false, data: commands });
});

export default router;

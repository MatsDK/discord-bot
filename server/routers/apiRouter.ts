import { prefixState } from "../../bot/constants";
import { Request, Response, Router } from "express";
import { commandType, createCmdBody } from "bot/types";
import { nanoid } from "nanoid";
import fs from "fs";
import Discord from "discord.js";
import path from "path";
import { clientState } from "../../bot/client";
import { getData } from "../utils/getData";
import { commandHandler } from "../../bot/handlers/commandHandler";

const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const client = clientState.client;

  const { channelsArr, rolesArr } = getData(client);
  res.json({
    err: false,
    data: {
      commands: client.commands,
      prefix: prefixState.PREFIX,
      channels: channelsArr,
      roles: rolesArr,
    },
  });
});

router.get("/getData/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = clientState.client;
  const thisCmd: commandType | undefined = client.commands.find(
    (_: commandType) => _.id === id
  );
  if (!thisCmd) return res.json({ err: "Command not found" });

  const { channelsArr, rolesArr } = getData(client);
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

  clientState.client.commands.clear();
  commandHandler(clientState.client, Discord);

  Object.keys(commands).forEach((key: string) => {
    commands[key].id = key;
  });
  res.json({ err: false, data: commands });
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

    if (!action) {
      const { default: commands } = await import(
        "../../bot/commands/commands.json"
      );
      let thisCmd: commandType = clientState.client.commands.get(
        commands[id].keyword
      );
      if (thisCmd) thisCmd = command;
      commands[id] = command;

      fs.writeFileSync(
        path.resolve(__dirname, "../../bot/commands/commands.json"),
        JSON.stringify(commands),
        null
      );

      clientState.client.commands.clear();
      commandHandler(clientState.client, Discord);
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

export default router;

import { prefixState } from "../../bot/constants";
import { Request, Response, Router } from "express";
import { commandType, createCmdBody } from "bot/types";
import { nanoid } from "nanoid";
import fs from "fs";
// import util from "util";:
import path from "path";
import { clientState } from "../../bot/client";
import { getData } from "../utils/getData";

const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const client = clientState.client;

  const { channelsArr, rolesArr } = getData(client);
  console.log(client.commands);
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

  Object.keys(commands).forEach((key: string) => {
    commands[key].id = key;
  });
  res.json({ err: false, data: commands });
});

router.post("/changeCmd", async (req: Request, res: Response) => {
  // const { default: commands } = await import(
  //   "../../bot/commands/commands.json"
  // );

  // commands["9sc5geKP2c_snuKt3T_Ia"].reply = "Test reply";

  // fs.writeFileSync(
  //   path.resolve(__dirname, "../../bot/commands/commands.json"),
  //   JSON.stringify(commands),
  //   null
  // );

  // ### ACTION ###
  const pingId: string = "e3gZU3hIXFDr4P_JnKzSf9";
  const commandData = await import("../../bot/commands/actions.json");

  const cmdId: string | undefined = Object.keys(commandData).find(
    (_: any) => _ === pingId
  );
  if (!cmdId) return res.json({ err: true });

  const thisCmd: commandType | undefined = commandData[cmdId];
  if (!thisCmd) return res.json({ err: true });

  thisCmd.description = "fdjsl";
  console.log(thisCmd, commandData);

  res.json({ err: false });
});

export default router;

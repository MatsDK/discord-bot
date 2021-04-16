import { prefixState } from "../../bot/constants";
import { Request, Response, Router } from "express";
import { commandType } from "bot/types";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
const router = Router();

router.get("/getData", async (req: Request, res: Response) => {
  const { default: commands } = await import(
    "../../bot/commands/commands.json"
  );
  Object.keys(commands).forEach((key: string) => {
    commands[key].id = key;
  });

  res.json({ err: false, data: { commands, prefix: prefixState.PREFIX } });
});

router.post("/createCmd", async (req: Request, res: Response) => {
  const { keyWord, description, reply } = req.body;
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
      allRoles: true,
      consentedRoles: [],
    },
    channels: [],
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

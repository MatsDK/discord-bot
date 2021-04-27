import { pollType } from "@/bot/types";
import { Request, Response, Router } from "express";
import { nanoid } from "nanoid";
import polls from "../../bot/poll.json";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/getPolls", (req: Request, res: Response) => {
  res.json({ polls });
});

router.post("/newPoll", (req: Request, res: Response) => {
  try {
    const pollsArray: pollType[] = Object.keys(polls).map(
      (_: string) => polls[_]
    );
    if (pollsArray.some((_: pollType) => _.name == req.body.name))
      return res.json({ err: "Poll with that name already exists" });

    polls[nanoid()] = req.body;
    fs.writeFileSync(
      path.resolve(__dirname, "../../bot/poll.json"),
      JSON.stringify(polls),
      null
    );

    res.json({ err: false });
  } catch (err) {
    res.json({ err: "An error occured" });
  }
});

export default router;

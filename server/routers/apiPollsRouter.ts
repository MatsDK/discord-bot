import { pollType } from "../../bot/types";
import { Request, Response, Router } from "express";
import { nanoid } from "nanoid";
import polls from "../../bot/poll.json";
import fs from "fs";
import path from "path";
import { getData } from "../../server/utils/getData";
import { clientState } from "../../bot/client";

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

router.get("/getPoll/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const thisPoll: pollType = polls[id];
    if (!thisPoll) return res.json({ err: "poll not found" });

    return res.json({
      err: false,
      data: thisPoll,
      roles: getData(clientState.client).rolesArr || [],
    });
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

router.post("/updatePoll", (req: Request, res: Response) => {
  try {
    const updatedPoll: pollType = req.body;
    let thisPoll: pollType | undefined = polls[updatedPoll.id];
    if (!thisPoll) return res.json({ err: "Poll not found" });
    if (thisPoll.id !== updatedPoll.id)
      return res.json("Unable to change the Id");

    polls[updatedPoll.id] = updatedPoll;

    fs.writeFileSync(
      path.resolve(__dirname, "../../bot/poll.json"),
      JSON.stringify(polls),
      null
    );
    res.json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

export default router;

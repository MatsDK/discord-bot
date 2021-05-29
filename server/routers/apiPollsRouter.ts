import { dbGuildType, pollType } from "../../bot/types";
import { Request, Response, Router } from "express";
import { nanoid } from "nanoid";
import { getData } from "../../server/utils/getData";
import { clientState } from "../../bot/client";
import guildBot from "../../server/db/models/guildBot";

const router = Router();

const getPolls = async (guildId: string): Promise<Array<pollType>> => {
  const dbGuild: dbGuildType = await guildBot.findOne({
    guildId,
  });

  return dbGuild?.polls;
};

router.get("/getPolls", async (req: Request, res: Response) => {
  const polls = await getPolls(req.query.guildId as string);
  if (!polls) return res.json({ polls: [] });

  const { data } = await getData(
    req.query.guildId as string,
    clientState.client
  );
  res.json({ polls, data });
});

router.post("/newPoll", async (req: Request, res: Response) => {
  try {
    const { guildId, ...newPoll } = req.body,
      polls = await getPolls(guildId as string);

    if (polls.some((_: pollType) => _.name == req.body.name))
      return res.json({ err: "Poll with that name already exists" });

    newPoll.id = nanoid();
    await guildBot.findOneAndUpdate(
      { guildId: guildId },
      { $push: { polls: newPoll } }
    );

    res.json({ err: false });
  } catch (err) {
    res.json({ err: "An error occured" });
  }
});

router.get("/getPoll/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params,
      { guildId } = req.query;

    const polls = await getPolls(guildId as string),
      thisPoll: pollType | undefined = polls.find((_: pollType) => _.id === id);
    if (!thisPoll) return res.json({ err: "poll not found" });

    const { data } = await getData(guildId as string, clientState.client);

    return res.json({
      err: false,
      data: thisPoll,
      guildData: data,
      roles:
        (await getData(guildId as string, clientState.client)).rolesArr || [],
    });
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

router.post("/updatePoll", async (req: Request, res: Response) => {
  try {
    const { guildId } = req.query;

    const polls = await getPolls(guildId as string),
      updatedPoll: pollType = req.body;

    let thisPoll: pollType | undefined = polls.find(
      (_: pollType) => _.id === updatedPoll.id
    );
    if (!thisPoll) return res.json({ err: "Poll not found" });
    if (thisPoll.id !== updatedPoll.id)
      return res.json("Unable to change the Id");

    return guildBot.findOne({ guildId }, async (err: any, guild: any) => {
      if (err) return res.json({ err: err.message });
      if (!guild) return res.json({ err: "Server not found" });

      const idx: number = guild.polls.findIndex(
        (_: pollType) => _.id === thisPoll!.id
      );
      if (idx < 0) return res.json({ err: "Poll not found" });
      guild.polls[idx] = updatedPoll;

      await guild.save();
      res.json({ err: false });
    });
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

export default router;

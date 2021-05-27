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
  return dbGuild.polls;
};

router.get("/getPolls", async (req: Request, res: Response) => {
  const polls = await getPolls(process.env.TMP_GUILD_ID as string);
  res.json({ polls });
});

router.post("/newPoll", async (req: Request, res: Response) => {
  try {
    const { ...newPoll } = req.body,
      polls = await getPolls(process.env.TMP_GUILD_ID as string);

    if (polls.some((_: pollType) => _.name == req.body.name))
      return res.json({ err: "Poll with that name already exists" });

    newPoll.id = nanoid();
    await guildBot.findOneAndUpdate(
      { guildId: process.env.TMP_GUILD_ID },
      { $push: { polls: newPoll } }
    );

    res.json({ err: false });
  } catch (err) {
    res.json({ err: "An error occured" });
  }
});

router.get("/getPoll/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const polls = await getPolls(process.env.TMP_GUILD_ID as string),
      thisPoll: pollType | undefined = polls.find((_: pollType) => _.id === id);
    if (!thisPoll) return res.json({ err: "poll not found" });

    return res.json({
      err: false,
      data: thisPoll,
      roles:
        getData(process.env.TMP_GUILD_ID as string, clientState.client)
          .rolesArr || [],
    });
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

router.post("/updatePoll", async (req: Request, res: Response) => {
  try {
    const polls = await getPolls(process.env.TMP_GUILD_ID as string),
      updatedPoll: pollType = req.body;

    let thisPoll: pollType | undefined = polls.find(
      (_: pollType) => _.id === updatedPoll.id
    );
    if (!thisPoll) return res.json({ err: "Poll not found" });
    if (thisPoll.id !== updatedPoll.id)
      return res.json("Unable to change the Id");

    return guildBot.findOne(
      { guildId: process.env.TMP_GUILD_ID },
      async (err: any, guild: any) => {
        if (err) return res.json({ err: err.message });
        if (!guild) return res.json({ err: "Server not found" });

        const idx: number = guild.polls.findIndex(
          (_: pollType) => _.id === thisPoll!.id
        );
        if (idx < 0) return res.json({ err: "Poll not found" });
        guild.polls[idx] = updatedPoll;

        await guild.save();
        res.json({ err: false });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ err: "An error occured" });
  }
});

export default router;

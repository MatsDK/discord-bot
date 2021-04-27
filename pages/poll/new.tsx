import Link from "next/link";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { PollOption } from "@/bot/types";
import PollOptions from "@/components/PollOptions";
import axios from "axios";
import { useRouter } from "next/router";

const PollPage = () => {
  const router = useRouter();
  const [pollNameInput, setPollNameInput] = useState<string>("");
  const [pollContentInput, setPollContentInput] = useState<string>("");
  const [pollDesriptionInput, setPollDesriptionInput] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { text: "yes", emoji: "✔" },
    { text: "No", emoji: "❌" },
  ]);

  const savePoll = () => {
    if (!pollNameInput.trim().length || !pollContentInput.trim().length)
      return alert("Pleace provide a Name and Question");

    if (pollOptions.length < 1) return alert("Please provide options");

    for (let option of pollOptions) {
      if (!option.text.trim().length || !option.emoji.trim().length)
        return alert("Please provide an emoji and text for every option");

      if (
        pollOptions.filter((_: PollOption) => _.emoji == option.emoji).length >
        1
      )
        return alert("You cannot use one emoji multiple times");
    }

    console.log(pollOptions);

    axios({
      method: "POST",
      url: "http://localhost:3001/api/poll/newPoll",
      data: {
        name: pollNameInput,
        content: pollContentInput,
        description: pollDesriptionInput,
        hadDuration: false,
        duration: 0,
        options: pollOptions,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        router.push("/poll");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Link href="/poll">Polls</Link>
      <Link href="/">Home</Link>
      <br />
      <input
        value={pollNameInput}
        onChange={(e) => setPollNameInput(e.target.value)}
        type="text"
        placeholder="Name"
      />
      <input
        value={pollContentInput}
        onChange={(e) => setPollContentInput(e.target.value)}
        type="text"
        placeholder="Question"
      />
      <input
        value={pollDesriptionInput}
        onChange={(e) => setPollDesriptionInput(e.target.value)}
        type="text"
        placeholder="Desription"
      />
      <PollOptions options={pollOptions} setOptions={setPollOptions} />
      <br />

      <button onClick={savePoll}>Save Poll</button>
    </div>
  );
};

export default PollPage;

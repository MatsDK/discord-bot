import Link from "next/link";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { PollOption } from "../../bot/types";
import PollOptions from "../../src/components/PollOptions";
import axios from "axios";
import { useRouter } from "next/router";
import PollForm from "../../src/components/PollForm";
import { checkPoll } from "../../src/checkPollOptions";

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
    const checkPollOptions = checkPoll(
      pollOptions,
      pollContentInput,
      pollContentInput
    );
    if (checkPollOptions.err) return alert(checkPollOptions.err);

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

  const PollFormProps = {
    updateFuncs: {
      setPollNameInput,
      setPollContentInput,
      setPollDesriptionInput,
    },
    inputs: { pollNameInput, pollContentInput, pollDesriptionInput },
  };

  return (
    <div>
      <Link href="/poll">Polls</Link>
      <Link href="/">Home</Link>
      <PollForm {...PollFormProps} />
      <PollOptions
        options={pollOptions}
        setOptions={setPollOptions}
        withRoles={false}
        roles={[]}
      />

      <button onClick={savePoll}>Save Poll</button>
    </div>
  );
};

export default PollPage;

import { PollOption, pollType, rolesType } from "../../../bot/types";
import PollForm from "../../../src/components/PollForm";
import PollOptions from "../../../src/components/PollOptions";
import axios from "axios";
import { Context } from "node:vm";
import { useState } from "react";
import { checkPoll } from "../../../src/checkPollOptions";
import Link from "next/link";

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface editPollProps {
  poll: pollType;
  roles: Array<rolesType>;
}

const Edit: nextFunctionComponent<editPollProps> = ({ poll, roles }) => {
  const [pollOptions, setPollOptions] = useState<PollOption[]>(poll.options);
  const [pollNameInput, setPollNameInput] = useState<string>(poll.name);
  const [pollContentInput, setPollContentInput] = useState<string>(
    poll.content
  );
  const [pollDesriptionInput, setPollDesriptionInput] = useState<string>(
    poll.description
  );

  const saveChanges = () => {
    const checkPollOptions = checkPoll(
      pollOptions,
      pollContentInput,
      pollNameInput,
      poll.rolePoll
    );
    if (checkPollOptions.err) return alert(checkPollOptions.err);

    axios({
      method: "POST",
      url: "http://localhost:3001/api/poll/updatePoll",
      data: {
        ...poll,
        name: pollNameInput,
        content: pollContentInput,
        desriptions: pollDesriptionInput,
        options: pollOptions,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
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
      <Link href="/">Home</Link>
      <Link href="/poll">Polls</Link>
      <PollForm {...PollFormProps} />
      <PollOptions
        setOptions={setPollOptions}
        options={pollOptions}
        withRoles={poll.rolePoll}
        roles={roles}
      />
      <button onClick={saveChanges}>Save Changes</button>
    </div>
  );
};

Edit.getInitialProps = async ({ query, res }: Context) => {
  const { id }: { id: string } = query;
  const apiRes = await axios({
    method: "GET",
    url: `http://localhost:3001/api/poll/getPoll/${id}`,
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) return res.redirect("/");
  return { poll: apiRes.data.data, roles: apiRes.data.roles };
};

export default Edit;

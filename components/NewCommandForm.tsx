import axios from "axios";
import { FormEvent, useState } from "react";

const NewCommandForm = ({ prefix, setCommands }) => {
  const [keyWordInput, setKeyWordInput] = useState<string>("");
  const [descriptionInput, setDesriptionInput] = useState<string>("");
  const [replyInput, setReplyInput] = useState<string>("");

  const createCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!keyWordInput.trim().length) return alert("You must enter a keyword");

    axios({
      method: "POST",
      url: "http://localhost:3001/api/createCmd",
      data: {
        keyWord: keyWordInput.trim(),
        description: descriptionInput,
        reply: replyInput,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        setCommands(
          Object.keys(res.data.data).map(
            (cmdName: string) => res.data.data[cmdName]
          )
        );
        setKeyWordInput("");
        setReplyInput("");
        setDesriptionInput("");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div>
      <form onSubmit={createCommand}>
        {prefix}
        <input
          type="text"
          placeholder="keyword"
          value={keyWordInput}
          onChange={(e) => setKeyWordInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={descriptionInput}
          onChange={(e) => setDesriptionInput(e.target.value)}
        />
        <textarea
          placeholder="reply"
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewCommandForm;
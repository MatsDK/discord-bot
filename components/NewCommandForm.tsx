import { FormEvent, useState } from "react";

const NewCommandForm = ({ prefix, create }) => {
  const [keyWordInput, setKeyWordInput] = useState<string>("");
  const [descriptionInput, setDesriptionInput] = useState<string>("");
  const [replyInput, setReplyInput] = useState<string>("");

  const createCommand = (e: FormEvent) => {
    e.preventDefault();
    create(keyWordInput, descriptionInput, replyInput);
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

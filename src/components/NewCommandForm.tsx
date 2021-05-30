import { FormEvent, useCallback, useState } from "react";

function useInput<T>(initialValue: T): [T, (e: any) => void] {
  const [state, setState] = useState<T>(initialValue);
  const onChange = useCallback((e) => {
    setState(e.currentTarget.value);
  }, []);

  return [state, onChange];
}

const NewCommandForm = ({ prefix, create }) => {
  const [keyWordInput, setKeyWordInput] = useInput<string>("");
  const [descriptionInput, setDesriptionInput] = useInput<string>("");
  const [replyInput, setReplyInput] = useInput<string>("");

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
          onChange={setKeyWordInput}
        />
        <input
          type="text"
          placeholder="description"
          value={descriptionInput}
          onChange={setDesriptionInput}
        />
        <textarea
          placeholder="reply"
          value={replyInput}
          onChange={setReplyInput}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewCommandForm;

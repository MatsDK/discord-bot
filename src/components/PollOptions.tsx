import { PollOption } from "../../bot/types";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

interface PollOptionsProps {
  options: Array<PollOption>;
  setOptions: Function;
}

const PollOptions: React.FC<PollOptionsProps> = ({ options, setOptions }) => {
  const newOption = () => {
    setOptions((options: PollOption[]) => [
      ...options,
      { text: "", emoji: "" },
    ]);
  };

  return (
    <div>
      {options.map((_: PollOption, idx: number) => {
        const updateOption = (text: string, emoji: string) => {
          options[idx] = { text, emoji };
          setOptions([...options]);
        };

        const deleteOption = () => {
          options = options.filter((_: PollOption, i: number) => i !== idx);
          setOptions([...options]);
        };

        return (
          <Option
            key={idx}
            {..._}
            updateOption={updateOption}
            deleteOption={deleteOption}
          />
        );
      })}
      <button onClick={newOption}>New Option</button>
    </div>
  );
};

interface OptionProps {
  emoji: string;
  text: string;
  updateOption: Function;
  deleteOption: Function;
}

const Option: React.FC<OptionProps> = ({ emoji, text, ...funcs }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [optionTextInput, setOptionTextInput] = useState<string>(text);

  return (
    <div style={{ display: "flex" }}>
      <div
        tabIndex={0}
        onBlur={() => setShowEmojiPicker(false)}
        onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
      >
        {emoji || "emoji"}
        {showEmojiPicker && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: "absolute",
            }}
          >
            <Picker
              onSelect={(e: any) => {
                funcs.updateOption(optionTextInput, e.native);
              }}
              // include={[]}
            />
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Options"
        value={optionTextInput}
        onChange={(e) => {
          setOptionTextInput(e.target.value);
          funcs.updateOption(e.target.value, emoji);
        }}
      />
      <button onClick={() => funcs.deleteOption()}>Delete</button>
    </div>
  );
};

export default PollOptions;

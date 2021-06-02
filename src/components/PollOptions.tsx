import { PollOption, rolesType } from "../../bot/types";
import { useEffect, useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import dynamic from "next/dynamic";
import styles from "../css/pollsPage.module.css";
import { PlusIcon, RemoveIcon } from "./icons";

interface PollOptionsProps {
  options: Array<PollOption>;
  withRoles: boolean;
  roles: Array<rolesType>;
  setOptions: Function;
}

const Select: any = dynamic(() => import("react-select"), { ssr: false });

const PollOptions: React.FC<PollOptionsProps> = ({
  options,
  setOptions,
  withRoles,
  roles,
}) => {
  const [roleOptions] = useState(
    roles.map((_: rolesType) => ({ value: _.id, label: _.name }))
  );

  const newOption = () => {
    setOptions((options: PollOption[]) => [
      ...options,
      withRoles ? { text: "", emoji: "" } : { text: "", emoji: "", id: null },
    ]);
  };

  return (
    <div className={styles.pollOptionsList}>
      {options.map((_: PollOption, idx: number) => {
        const updateOption = (text: string, emoji: string, id?: string) => {
          const newObj: any = { text, emoji };
          if (withRoles) newObj.id = id;

          options[idx] = newObj;
          setOptions([...options]);
        };

        const deleteOption = () => {
          options = options.filter((_: PollOption, i: number) => i !== idx);
          setOptions([...options]);
        };

        return withRoles ? (
          <RoleOption
            key={idx}
            roles={roleOptions}
            id={_.id || ""}
            {..._}
            updateOption={updateOption}
            deleteOption={deleteOption}
          />
        ) : (
          <Option
            key={idx}
            {..._}
            updateOption={updateOption}
            deleteOption={deleteOption}
          />
        );
      })}
      <button className={styles.addOptionButton} onClick={newOption}>
        <PlusIcon />
        <p>Add Option</p>
      </button>
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
    <div className={styles.pollOption}>
      <div
        tabIndex={0}
        onBlur={() => setShowEmojiPicker(false)}
        onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
      >
        <div className={styles.emojiPlaceHolder}>
          {emoji ? <p>{emoji}</p> : <p className={styles.placeHolder}></p>}
        </div>

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
      <button
        className={styles.removeButton}
        onClick={() => funcs.deleteOption()}
      >
        <RemoveIcon />
      </button>
    </div>
  );
};

interface RoleOptionProps extends OptionProps {
  id: string;
  roles: { value: string; label: string }[];
}

const RoleOption: React.FC<RoleOptionProps> = ({
  emoji,
  text,
  id,
  roles,
  ...funcs
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelecteEmoji] = useState<string>(emoji);
  const [optionTextInput, setOptionTextInput] = useState<string>(text);
  const [selectedRole, setSelectedRole] = useState<any>(
    roles.find((_: any) => _.value === id)
  );

  useEffect(() => {
    funcs.updateOption(optionTextInput, selectedEmoji, selectedRole?.value);
  }, [selectedRole]);

  return (
    <div className={styles.pollOption}>
      <div
        tabIndex={0}
        onBlur={() => setShowEmojiPicker(false)}
        onClick={(e) => setShowEmojiPicker(!showEmojiPicker)}
      >
        <div className={styles.emojiPlaceHolder}>
          {!!emoji ? <p>{emoji}</p> : <p className={styles.placeHolder}></p>}
        </div>
        {showEmojiPicker && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: "absolute",
            }}
          >
            <Picker
              onSelect={(e: any) => {
                setSelecteEmoji(e.native);
                funcs.updateOption(optionTextInput, e.native);
              }}
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
          funcs.updateOption(e.target.value, selectedEmoji);
        }}
      />
      <div className={styles.selectRole}>
        <Select
          value={selectedRole}
          onChange={(selectedRole: any) => {
            setSelectedRole(selectedRole);
          }}
          options={roles}
        />
      </div>
      <button
        className={styles.removeButton}
        onClick={() => funcs.deleteOption()}
      >
        <RemoveIcon />
      </button>
    </div>
  );
};

export default PollOptions;

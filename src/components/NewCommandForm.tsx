import { channelsType, rolesType } from "bot/types";
import { FormEvent, useState } from "react";
import { useInput } from "src/hooks/useInput";
import styles from "../css/commandPage.module.css";
import SelectChannelsContainer from "./SelectChannelsContainer";
import SelectRolesContainer from "./SelectRolesContainer";

type createFunction = (
  keywordInput: string,
  descriptionInput: string,
  replyInput: string,
  selectedChannels: string[],
  selectedRoles: string[]
) => void;

interface NewCommandFormProps {
  prefix: string;
  create: createFunction;
  channels: channelsType[];
  roles: rolesType[];
}

const NewCommandForm: React.FC<NewCommandFormProps> = ({
  prefix,
  create,
  channels,
  roles,
}) => {
  const [keyWordInput, setKeyWordInput] = useInput<string>("");
  const [descriptionInput, setDesriptionInput] = useInput<string>("");
  const [replyInput, setReplyInput] = useInput<string>("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.map((_: channelsType) => _.id)
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    roles.map((_: rolesType) => _.id)
  );

  const createCommand = (e: FormEvent) => {
    e.preventDefault();
    create(
      keyWordInput,
      descriptionInput,
      replyInput,
      selectedChannels,
      selectedRoles
    );
  };

  return (
    <div>
      <form className={styles.newCommandForm} onSubmit={createCommand}>
        <label>Keyword</label>
        <div className={styles.keywordInput}>
          <p>{prefix}</p>
          <input
            type="text"
            placeholder="keyword"
            value={keyWordInput}
            onChange={setKeyWordInput}
          />
        </div>
        <label>Description</label>
        <input
          type="text"
          placeholder="description"
          value={descriptionInput}
          onChange={setDesriptionInput}
        />
        <label>Response</label>
        <textarea
          placeholder="reply"
          value={replyInput}
          onChange={setReplyInput}
        />
        <div className={styles.selectionContainer}>
          <SelectChannelsContainer
            channels={channels}
            setSelectedChannels={setSelectedChannels}
            selectedChannels={selectedChannels}
          />
        </div>
        <div className={styles.selectionContainer}>
          <SelectRolesContainer
            roles={roles}
            setSelectedRoles={setSelectedRoles}
            selectedRoles={selectedRoles}
          />
        </div>
        <button type="submit" className={styles.saveButton}>
          Save Command
        </button>
      </form>
    </div>
  );
};

export default NewCommandForm;

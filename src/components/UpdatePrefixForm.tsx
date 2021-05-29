import axios from "axios";
import styles from "../../src/css/commandPage.module.css";
import { FormEvent } from "react";
import { RemoveIcon } from "./icons";

interface UpdatePrefixProps {
  prefix: string;
  initialPrefix: string;
  setPrefix: Function;
  guildId: string;
}

const UpdatePrefixForm: React.FC<UpdatePrefixProps> = ({
  prefix,
  initialPrefix,
  setPrefix,
  guildId,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prefix.trim().length) return alert("Invalid prefix");

    axios({
      method: "POST",
      url: "http://localhost:3001/api/setPrefix",
      data: {
        guildId,
        prefix,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
      })
      .catch((err) => {
        console.log(err);
        setPrefix(initialPrefix);
      });
  };

  return (
    <div className={styles.updatePrefixWrapper}>
      <span className={styles.changePrefixHeader}>Change Prefix</span>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
          <button onClick={() => setPrefix(initialPrefix)}>
            <RemoveIcon color="rgb(83, 83, 83)" />
          </button>
        </div>
        <button className={styles.saveButton} type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdatePrefixForm;

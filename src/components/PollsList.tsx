import { pollType } from "../../bot/types";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../css/pollsPage.module.css";
import { EditIcon, RemoveIcon } from "./icons";
import axios from "axios";
import { useState } from "react";

interface PollsListProps {
  polls: Array<pollType>;
}

const PollsList: React.FC<PollsListProps> = (props) => {
  const [polls, setPolls] = useState<pollType[]>(props.polls);
  const router = useRouter();
  const { guildId } = router.query;

  const deletePoll = ({ id }: pollType) => {
    axios({
      method: "DELETE",
      url: "http://localhost:3001/api/poll/deletePoll",
      data: { guildId, id },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
        setPolls(res.data.polls);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={styles.pollsListHeader}>
        <span className={styles.nameHeader}>Name</span>
        <span className={styles.descriptionHeader}>Description</span>
        <span className={styles.optionsHeader}>Options</span>
        <div></div>
      </div>
      <div className={styles.pollsList}>
        {polls.map((_: pollType, idx: number) => (
          <div className={styles.pollsListItem} key={idx}>
            <p className={styles.pollName}>{_.name}</p>
            <p className={styles.description}>{_.description}</p>
            <p className={styles.options}>{_.options.length}</p>
            <div className={styles.buttonsWrapper}>
              <div onClick={() => deletePoll(_)}>
                <RemoveIcon />
              </div>
              <Link href={`/${router.query.guildId}/poll/edit/${_.id}`}>
                <div>
                  <EditIcon />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PollsList;

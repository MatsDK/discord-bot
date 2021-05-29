import styles from "../css/Layout.module.css";
import { CommandsIcon, DropDownIcon, IgnoredIcon, PollsIcon } from "./icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { guildDataObj } from "bot/types";

const Siderbar: React.FC<{ guildData: guildDataObj }> = ({ guildData }) => {
  const router = useRouter();
  const { thisGuild, guilds } = guildData;

  console.log(guilds);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {thisGuild?.imgURL && <img src={thisGuild?.imgURL} />}
        <div>
          <p>{thisGuild?.name}</p>
          <p
            className={`${styles.serverStatus} ${
              thisGuild?.active && styles.activeServerStatus
            }`}
          >
            {thisGuild?.active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className={styles.dropDownIcon}>
          <DropDownIcon />
        </div>
      </div>
      {[""].map(() => {
        const isActive: boolean =
          router.asPath.includes("commands") ||
          router.asPath === "/" + router.query.guildId;

        return (
          <Link href={`/${router.query.guildId}`} key={0}>
            <div style={{ marginTop: "50px" }} className={styles.sidebarItem}>
              <CommandsIcon active={isActive} />
              {isActive ? (
                <p className={styles.activeSidebarItem}>Commands</p>
              ) : (
                <p>Commands</p>
              )}
            </div>
          </Link>
        );
      })}
      {[""].map((_) => {
        const isActive: boolean = router.asPath.includes("poll");

        return (
          <Link href={`/${router.query.guildId}/poll`} key={0}>
            <div className={styles.sidebarItem}>
              <PollsIcon active={isActive} />
              {isActive ? (
                <p className={styles.activeSidebarItem}>Polls</p>
              ) : (
                <p>Polls</p>
              )}
            </div>
          </Link>
        );
      })}
      {[""].map((_) => {
        const isActive: boolean = router.asPath.includes("ignored");

        return (
          <Link href={`/${router.query.guildId}/ignored`} key={0}>
            <div className={styles.sidebarItem}>
              <IgnoredIcon active={isActive} />
              {isActive ? (
                <p className={styles.activeSidebarItem}>Ignored</p>
              ) : (
                <p>Ignored</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Siderbar;

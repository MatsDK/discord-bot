import styles from "../css/Layout.module.css";
import { CommandsIcon, PollsIcon } from "./icons";
import { useRouter } from "next/router";
import Link from "next/link";

const Siderbar: React.FC<{ guildData: any }> = ({ guildData }) => {
  const router = useRouter();

  console.log(guildData);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {guildData.img && <img src={guildData.img} />}
      </div>
      {[""].map((_) => {
        const isActive: boolean =
          router.asPath.includes("commands") || router.asPath === "/";

        return (
          <Link href="/" key={0}>
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
          <Link href="/poll" key={0}>
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
    </div>
  );
};

export default Siderbar;

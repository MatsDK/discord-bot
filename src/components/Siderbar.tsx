import styles from "../css/Layout.module.css";
import { CommandsIcon, DropDownIcon, IgnoredIcon, PollsIcon } from "./icons";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import { guildData, guildDataObj } from "bot/types";
import { useState } from "react";

const Siderbar: React.FC<{ guildData: guildDataObj }> = ({ guildData }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const { thisGuild, guilds } = guildData;

  return (
    <div className={styles.sidebar}>
      <div
        className={`${styles.sidebarTop} ${showDropdown && styles.active} `}
        tabIndex={0}
        onBlur={() => {
          setShowDropdown(false);
        }}
        onClick={(e) => {
          setShowDropdown(!showDropdown);
        }}
      >
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

        {showDropdown && (
          <div className={styles.dropDownMenu}>
            {guilds.map((_: guildData, idx: number) => (
              <Link key={idx} href={`/${_.guildId}`}>
                <div className={styles.dropDownItem}>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <CommandsItem router={router} />
      <PollItem router={router} />
      <IgnoredItem router={router} />
      {[""].map((_) => {})}
    </div>
  );
};

type SidebarItem = React.FC<{ router: NextRouter }>;

const CommandsItem: SidebarItem = ({ router }) => {
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
};

const PollItem: SidebarItem = ({ router }) => {
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
};

const IgnoredItem: SidebarItem = ({ router }) => {
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
};

export default Siderbar;

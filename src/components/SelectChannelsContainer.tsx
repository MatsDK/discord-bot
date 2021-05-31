import { channelsType } from "../../bot/types";
import styles from "../css/commandPage.module.css";

interface SelectChannelsProps {
  channels: Array<channelsType>;
  selectedChannels: Array<string>;
  setSelectedChannels: Function;
}

const SelectChannelsContainer: React.FC<SelectChannelsProps> = ({
  channels,
  setSelectedChannels,
  selectedChannels,
}) => {
  const selectAll = () => {
    if (channels.length === selectedChannels.length) setSelectedChannels([]);
    else setSelectedChannels(channels.map((_: channelsType) => _.id));
  };

  return (
    <div>
      <div className={styles.selectionContainerHeader}>
        <label>Channels</label>
        <button
          type="button"
          className={styles.selectAllButton}
          onClick={selectAll}
        >
          Select All
        </button>
      </div>
      <div className={styles.selectionItemsContainer}>
        {channels.map((_: channelsType, idx: number) => {
          const active: boolean = !!selectedChannels.find(
            (channelId: string) => channelId === _.id
          );

          return (
            <div
              className={`${styles.selectionItem} ${
                active && styles.activeSelectionItem
              }`}
              key={idx}
              onClick={() => {
                const i: number = selectedChannels.indexOf(_.id);
                if (i < 0)
                  setSelectedChannels((selectedChannels) => [
                    _.id,
                    ...selectedChannels,
                  ]);
                else
                  setSelectedChannels((selectedChannels) =>
                    selectedChannels.filter(
                      (_: string, index: number) => index !== i
                    )
                  );
              }}
            >
              {_.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectChannelsContainer;

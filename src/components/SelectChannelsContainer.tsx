import { channelsType } from "../../bot/types";

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
      <button onClick={selectAll}>Select All</button>
      {channels.map((_: channelsType, idx: number) => {
        const active: boolean = !!selectedChannels.find(
          (channelId: string) => channelId === _.id
        );

        return (
          <div
            style={{ color: active ? "blue" : "black" }}
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
  );
};

export default SelectChannelsContainer;

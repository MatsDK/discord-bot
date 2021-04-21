import { channelsType } from "@/bot/types";

interface SelectChannelsProps {
  channels: Array<channelsType>;
  setSelectedChannels: Function;
  selectedChannels: Array<string>;
}

const SelectChannelsContainer: React.FC<SelectChannelsProps> = ({
  channels,
  setSelectedChannels,
  selectedChannels,
}) => {
  return (
    <div>
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

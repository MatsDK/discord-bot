import { pollType } from "@/bot/types";
import Link from "next/link";

interface PollsListProps {
  polls: Array<pollType>;
}

const PollsList: React.FC<PollsListProps> = ({ polls }) => {
  return (
    <div>
      {polls.map((_: pollType, idx: number) => (
        <div key={idx} style={{ display: "flex" }}>
          <p>{_.name}</p>
          <p>{_.description}</p>
          <p>{_.options.length} options</p>
          <Link href={`/poll/edit/${_.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
};

export default PollsList;

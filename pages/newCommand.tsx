import NewCommandForm from "@/components/NewCommandForm";

const newCommand = ({ prefix, ...rest }) => {
  return (
    <div>
      <NewCommandForm prefix={prefix} />
    </div>
  );
};

export default newCommand;

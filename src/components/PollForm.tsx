const PollForm = ({ updateFuncs, inputs }) => {
  return (
    <div>
      <input
        value={inputs.pollNameInput}
        onChange={(e) => updateFuncs.setPollNameInput(e.target.value)}
        type="text"
        placeholder="Name"
      />
      <input
        value={inputs.pollContentInput}
        onChange={(e) => updateFuncs.setPollContentInput(e.target.value)}
        type="text"
        placeholder="Question"
      />
      <input
        value={inputs.pollDesriptionInput}
        onChange={(e) => updateFuncs.setPollDesriptionInput(e.target.value)}
        type="text"
        placeholder="Desription"
      />
    </div>
  );
};

export default PollForm;

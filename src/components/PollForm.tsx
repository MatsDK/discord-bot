import styles from "../css/pollsPage.module.css";

const PollForm = ({ updateFuncs, inputs }) => {
  return (
    <div className={styles.pollFormContainer}>
      <label>Name</label>
      <input
        value={inputs.pollNameInput}
        onChange={updateFuncs.setPollNameInput}
        className={`${styles.pollFormInput} ${styles.nameInput}`}
        type="text"
        placeholder="Name"
      />
      <label>Description</label>
      <input
        value={inputs.pollDesriptionInput}
        onChange={updateFuncs.setPollDesriptionInput}
        className={styles.pollFormInput}
        type="text"
        placeholder="Desription"
      />
      <label>Question</label>
      <textarea
        value={inputs.pollContentInput}
        className={styles.pollFormInput}
        onChange={updateFuncs.setPollContentInput}
        // placeholder="Question"
      />
    </div>
  );
};

export default PollForm;

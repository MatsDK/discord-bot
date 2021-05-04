import axios from "axios";
import { FormEvent } from "react";

interface UpdatePrefixProps {
  prefix: string;
  initialPrefix: string;
  setPrefix: Function;
}

const UpdatePrefixForm: React.FC<UpdatePrefixProps> = ({
  prefix,
  initialPrefix,
  setPrefix,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!prefix.trim().length) return alert("Invalid prefix");

    axios({
      method: "POST",
      url: "http://localhost:3001/api/setPrefix",
      data: {
        prefix,
      },
    })
      .then((res) => {
        if (res.data.err) return alert(res.data.err);
      })
      .catch((err) => {
        console.log(err);
        setPrefix(initialPrefix);
      });
  };

  return (
    <div>
      <h5 style={{ margin: "0" }}>Set Prefix</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <button onClick={() => setPrefix(initialPrefix)}>Reset</button>
        <button type="submit">Save prefix</button>
      </form>
    </div>
  );
};

export default UpdatePrefixForm;

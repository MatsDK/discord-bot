import axios from "axios";
import React, { useEffect, useState } from "react";
import { commandType } from "bot/types";

const Index = ({ data }): JSX.Element => {
  const [commands] = useState<commandType[]>(
    Object.keys(data).map((cmdName: string) => data[cmdName])
  );

  useEffect(() => {
    console.log(commands);
  }, [commands]);

  return <div></div>;
};

export const getStaticProps = async () => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  });

  if (res.data.err) return { props: { data: {} } };
  return {
    props: { data: res.data.data },
  };
};
export default Index;

export default (time: any): number | { err: string } => {
  const regex = new RegExp(/^([0-9]{2}|[0-9]{1})[sSmMhH]$/);

  if (regex.test(time)) {
    if (time.toLowerCase().endsWith("s")) {
      time = parseInt(time.substring(0, time.indexOf("s")));
      time *= 1000;
    } else if (time.toLowerCase().endsWith("m")) {
      time = parseInt(time.substring(0, time.indexOf("m")));
      time *= 60 * 1000;
    } else if (time.toLowerCase().endsWith("h")) {
      time = parseInt(time.substring(0, time.indexOf("h")));
      time *= 60 * 60 * 100;
    }
  } else return { err: "Invalid Time input" };

  return time;
};

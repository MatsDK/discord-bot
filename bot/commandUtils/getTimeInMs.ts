export default (time: any): any => {
  if (isTimeStr(time)) {
    if (time.toLowerCase().endsWith("s")) {
      time = Number(time.substring(0, time.indexOf("s")));
      time *= 1000;
    } else if (time.toLowerCase().endsWith("m")) {
      time = Number(time.substring(0, time.indexOf("m")));
      time *= 60 * 1000;
    } else if (time.toLowerCase().endsWith("h")) {
      time = Number(time.substring(0, time.indexOf("h")));
      time *= 60 * 60 * 1000;
    } else if (time.toLowerCase().endsWith("d")) {
      time = Number(time.substring(0, time.indexOf("d")));
      time *= 24 * 60 * 60 * 1000;
    }
  } else return { err: "Invalid Time input" };

  return { ms: time, formattedDuration: msToTime(time) };
};

export const msToTime = (duration: number): string => {
  let seconds: any = Math.floor((duration / 1000) % 60),
    minutes: any = Math.floor((duration / (1000 * 60)) % 60),
    hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days: any = Math.floor((duration / (1000 * 60 * 60 * 24)) % 7);

  let dur: string = "";
  if (days) dur += `${days} day${days > 1 ? "s" : ""}`;
  if (hours) dur += `${days ? ", " : ""}${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes)
    dur += `${hours ? ", " : ""}${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (seconds)
    dur += `${minutes ? ", " : ""}${seconds} second${seconds > 1 ? "s" : ""}`;
  return dur;
};

export const isTimeStr = (str: string): boolean => {
  const regex = new RegExp(/^([0-9]{2}|[0-9]{1})[sSmMhHdD]$/);
  return regex.test(str);
};

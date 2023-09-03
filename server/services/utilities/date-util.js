function parseDuration(duration) {
  const regex = /(\d+d)?\s*(\d+h)?\s*(\d+m)?\s*(\d+s)?/;
  const matches = duration.match(regex);

  const days = parseInt(matches[1]) || 0;
  const hours = parseInt(matches[2]) || 0;
  const minutes = parseInt(matches[3]) || 0;
  const seconds = parseInt(matches[4]) || 0;

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function addDuration(date, durationStr) {
  const { days, hours, minutes, seconds } = parseDuration(durationStr);

  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(date.getSeconds() + seconds);

  return date;
}

function subtractDuration(date, durationStr) {
  const { days, hours, minutes, seconds } = parseDuration(durationStr);

  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);
  date.setSeconds(date.getSeconds() - seconds);

  return date;
}

function formatDateDiff(date1, date2) {
  const timeDifference = Math.abs(date2 - date1);

  const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

  const formattedDiff = [];
  if (days > 0) formattedDiff.push(`${days} days`);
  if (hours > 0) formattedDiff.push(`${hours} hours`);
  if (minutes > 0) formattedDiff.push(`${minutes} minutes`);
  if (seconds > 0) formattedDiff.push(`${seconds} seconds`);

  return formattedDiff.join(" ");
}

export default {
  parseDuration,
  addDuration,
  subtractDuration,
  formatDateDiff,
};

export const paddNum = (num, padsize) => {
  return typeof num !== 'undefined'
    ? num.toString().length > padsize
      ? num
      : new Array(padsize - num.toString().length + 1).join('0') + num
    : undefined;
};

export const chunkArray = (inputArray, chunkSize) => {
  const results = [];

  while (inputArray.length) {
    results.push(inputArray.splice(0, chunkSize));
  }

  return results;
};

export const areSameDates = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const range = (start, end) => {
  const results = [];

  for (let i = start; i <= end; i++) {
    results.push(i);
  }
  return results;
};

export const to12HourClock = (hours) => {
  const remainder = hours % 12;
  return remainder === 0 ? 12 : remainder;
};

export const to24HourClock = (hours, PM) => {
  return PM ? (hours === 12 ? hours : hours + 12) : hours === 12 ? 0 : hours;
};

export const isPM = (hours) => {
  return hours >= 12;
};

export const boundNumber = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const isLeapYear = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

export const isValidDate = (day, month, year) => {
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (isLeapYear(year)) {
    monthLength[1] = 29;
  }

  if (year < 0) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 0 || day > monthLength[month - 1]) {
    return false;
  }

  return true;
};

export const padNum = (num, padSize) => {
  return typeof num !== 'undefined'
    ? num.toString().length > padSize
      ? num
      : new Array(padSize - num.toString().length + 1).join('0') + num
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

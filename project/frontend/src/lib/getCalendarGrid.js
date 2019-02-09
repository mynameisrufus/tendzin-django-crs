import getCalendarMonthWeeks from "./getCalendarMonthWeeks";

const monthsArray = (firstDay, numMonths, offset) => {
  const accum = Array(numMonths);
  for (let i = 0; i < numMonths; i++) {
    accum[i] = firstDay.clone().add(offset + i, "month");
  }
  return accum;
};

const getMonths = (firstDay, numMonths, offset) => {
  return monthsArray(firstDay, numMonths, offset);
};

const getMonthWeeks = month => {
  return getCalendarMonthWeeks(month, false);
};

const getCalendarGrid = (firstDay, numMonths, offset) => {
  return getMonths(firstDay, numMonths, offset).map(month => {
    return {
      date: month,
      weeks: getMonthWeeks(month)
    };
  });
};

export default getCalendarGrid;

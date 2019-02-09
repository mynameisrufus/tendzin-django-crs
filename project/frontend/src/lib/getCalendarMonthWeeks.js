/** @license
The MIT License (MIT)

Copyright (c) 2016 Airbnb

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
* */

import moment from "moment";

export default function getCalendarMonthWeeks(month, enableOutsideDays) {
  const firstDayOfWeek = moment.localeData().firstDayOfWeek();

  // set utc offset to get correct dates in future (when timezone changes)
  const firstOfMonth = month
    .clone()
    .startOf("month")
    .hour(12);
  const lastOfMonth = month
    .clone()
    .endOf("month")
    .hour(12);

  // calculate the exact first and last days to fill the entire matrix
  // (considering days outside month)
  const prevDays = (firstOfMonth.day() + 7 - firstDayOfWeek) % 7;
  const nextDays = (firstDayOfWeek + 6 - lastOfMonth.day()) % 7;
  const firstDay = firstOfMonth.clone().subtract(prevDays, "day");
  const lastDay = lastOfMonth.clone().add(nextDays, "day");

  const totalDays = lastDay.diff(firstDay, "days") + 1;

  const currentDay = firstDay.clone();
  const weeksInMonth = [];

  for (let i = 0; i < totalDays; i += 1) {
    if (i % 7 === 0) {
      weeksInMonth.push([]);
    }

    let day = null;
    if ((i >= prevDays && i < totalDays - nextDays) || enableOutsideDays) {
      day = currentDay.clone();
    }

    weeksInMonth[weeksInMonth.length - 1].push(day);

    currentDay.add(1, "day");
  }

  return weeksInMonth;
}

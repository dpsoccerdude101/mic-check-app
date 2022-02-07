import { Address } from 'src/types';

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();

const ensureIsDate = (date: Date): Date => {
  if (typeof (date) !== typeof (Date)) {
    date = new Date(date);
  }
  return date;
};

const formatDateToDayOfWeek = (date: Date) => {
  date = ensureIsDate(date);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
  return dayOfWeek;
};

const formatDateToString = (date: Date) => {
  date = ensureIsDate(date);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
  const dayOfMonth = date.toLocaleDateString('en-US', { day: '2-digit' });
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  return `${dayOfWeek} ${dayOfMonth} ${monthName}`;
};

const formatDateLiteral = (date: Date) => {
  date = ensureIsDate(date);
  const dayOfMonth = date.toLocaleDateString('en-us', { day: '2-digit' });
  const monthName = date.toLocaleString('en-us', { month: 'short' });
  const year = date.getFullYear();
  return `${monthName} ${dayOfMonth}, ${year}`;
};

const formatDate = (date: Date) => {
  if (!date) { return ''; }

  date = ensureIsDate(date);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${year}`;
};

const formatTime = (date: Date) => {
  date = ensureIsDate(date);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
};

const formatMoney = (value: number, showFree?: boolean) => {
  if (showFree == null) { showFree = true; }
  const currency = (num: number) => `$ ${num.toFixed(2)}`;
  if (!showFree || value > 0) { return currency(value); }

  return 'Free';
};

const formatDateAndTime = (date: Date) => {
  const dateStr = formatDateToString(date);
  const timeStr = formatTime(date);
  return `${dateStr} ${timeStr}`;
};

export const formatAddress = (address: Address) => {
  let formattedAddr = '';
  if (address) {
    const { formatted, secondary } = address;
    if (formatted) { formattedAddr = formatted; } else if (secondary) { formattedAddr = secondary; }
  }
  return formattedAddr;
};

const formatter = {
  capitalize,
  formatAddress,
  formatDate,
  formatDateToDayOfWeek,
  formatDateAndTime,
  formatDateLiteral,
  formatMoney,
  formatTime,
  formatDateToString
};

export default formatter;

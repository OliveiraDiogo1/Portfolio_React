const UNITS = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
];

export function relativeTime(date, lang, now = Date.now()) {
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) {
    return '';
  }

  const diff = timestamp - now;
  const formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

  for (let index = 0; index < UNITS.length; index += 1) {
    const [unit, size] = UNITS[index];
    const isLast = index === UNITS.length - 1;
    if (Math.abs(diff) >= size || isLast) {
      return formatter.format(Math.round(diff / size), unit);
    }
  }

  return '';
}

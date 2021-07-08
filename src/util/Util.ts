export function hasTimeExpired(time: number) {
  return time === -1 ? false : new Date().getTime() < time;
}

export function formatBytes(a: number, b = 2) {
  if (0 === a) return '0 Bytes';
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    ' ' +
    ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  );
}

/**
 *Convert miliseconds to readable time
 *
 * @export
 * @param {number} ms
 * @return {*}
 */
export function msToTime(ms: number) {
  const seconds = parseFloat((ms / 1000).toFixed(1));
  const minutes = parseFloat((ms / (1000 * 60)).toFixed(1));
  const hours = parseFloat((ms / (1000 * 60 * 60)).toFixed(1));
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) return seconds + ' Seconds';
  else if (minutes < 60) return minutes + ' Minutes';
  else if (hours < 24) return hours + ' Hours';
  else return days + ' Days';
}

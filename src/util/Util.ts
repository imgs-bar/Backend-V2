export function hasTimeExpired(time: number) {
  return time === -1 ? false : new Date().getTime() < time;
}

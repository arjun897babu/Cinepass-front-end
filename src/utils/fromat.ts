
export function formatTime(time: number): string {
  const min = Math.floor(time / 60);
  const sec = Math.round(time % 60);
  const formattedSec = sec < 10 ? `0${sec}` : sec;

  return `${min}:${formattedSec}`;
}

/**
 * Format Date
 */

export function formatDate(format: string, date?: Date): string {
  const d = date ?? new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  const formattedDate = format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);

  return formattedDate;
}
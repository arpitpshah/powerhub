export const formatDate = (date:any) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export function parseCustomDate(dateString: string): Date | null {
    const dateTimeParts = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{1,2}):(\d{1,2}) (AM|PM)/i);

    if (!dateTimeParts) {
      console.error('Invalid date format:', dateString);
      return null;
    }
  
    const [ , day, month, year, hourString, minute, second, meridian ] = dateTimeParts;
    
    let hour = parseInt(hourString, 10);
    // Convert 12-hour format to 24-hour.
    if (meridian.toLowerCase() === 'pm' && hour < 12) {
      hour += 12;
    } else if (meridian.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
  
    // JavaScript months are 0-indexed, so subtract 1.
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour, parseInt(minute, 10), parseInt(second, 10));
    return date;
  }
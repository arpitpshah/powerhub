export function calculateCost(units: number, hour: number): number {
    const peakRate = 0.20;
    const offPeakRate = 0.10;
    return isPeakHour(hour) ? units * peakRate : units * offPeakRate;
  }
  
  export function formatDateForDisplay(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  export function isPeakHour(hour: number): boolean {
    return hour >= 17 && hour < 21;
  }
  
  export function getPreviousMonthDateRange() {
    const now = new Date();
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return { firstDayOfPreviousMonth, lastDayOfPreviousMonth };
  }
  
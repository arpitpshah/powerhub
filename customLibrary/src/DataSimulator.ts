// Class `DataSimulator` for simulating data related to electricity consumption.
class DataSimulator {

  /**
   * Static method to generate simulated electricity consumption data.
   * @param hours - Total number of hours to simulate.
   * @param peakHours - Object containing the start and end hours of peak consumption.
   * @param avgConsumption - Object containing average consumption values for peak and off-peak hours.
   * @returns An array of simulated electricity consumption values for each hour.
   */
  static generateElectricityUnits(hours: number, peakHours: { start: number; end: number }, avgConsumption: { peak: number; offPeak: number }): number[] {
    const data: number[] = [];

    // Loop through each hour to simulate consumption.
    for (let hour = 0; hour < hours; hour++) {
      let consumption;
      // Check if the current hour is within peak hours.
      if (hour >= peakHours.start && hour <= peakHours.end) {
        // Calculate peak hours consumption.
        // Randomly varies between the peak and off-peak average, favoring the peak.
        consumption = Math.random() * (avgConsumption.peak - avgConsumption.offPeak) + avgConsumption.offPeak;
      } else {
        // Calculate off-peak hours consumption.
        // Randomly varies up to the average off-peak consumption.
        consumption = Math.random() * avgConsumption.offPeak;
      }
      // Add the calculated consumption to the data array.
      data.push(consumption);
    }

    // Return the array of simulated consumption data.
    return data;
  }
}

// Export the DataSimulator class for use in other modules.
export default DataSimulator;

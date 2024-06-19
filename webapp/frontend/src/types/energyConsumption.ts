
export type Sortable = string | number | Date;
export type DailyElectricityData = {
  day: number;
  totalUnits: number;
  totalCost: number;
  [key: string]: Sortable;
};

export interface PieChartData {
    name: string;
    value: number;
  }
  
export interface EnergyData {
    energyConsumption: number;
    timeStamp: string;
    userId: string;
  }


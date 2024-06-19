This library offers a collection of utilities to simulate and transform data, particularly useful for scenarios involving energy consumption data simulation and general data transformation. The library includes two main modules: DataSimulator and DataTransformer.

Installation
To install the library, run the following command in your project directory:
```typescript
npm install datapowerutils
```
Modules

DataSimulator is a utility class for generating simulated energy consumption data.

Usage

```typescript
import DataSimulator from powerdatautils/DataSimulator;
const simulatedData = DataSimulator.generateElectricityUnits(hours, peakHours, avgConsumption);
```

Methods


generateElectricityUnits(hours, peakHours, avgConsumption)

hours: Number of hours for which data is to be generated.
peakHours: Object specifying the start and end of peak hours ({ start: number, end: number }).
avgConsumption: Object specifying average consumption rates during peak and off-peak hours ({ peak: number, offPeak: number }).


Returns an array of numbers representing simulated energy consumption for each hour.


DataTransformer is a utility class for sorting arrays of objects.

```typescript
import DataTransformer from powerdatautils/DataTransformer;
const sortedData = DataTransformer.sortData(dataArray, sortByKey, isAscending);
```

Usage

```typescript
import DataTransformer from powerdatautils/DataTransformer;
const sortedData = DataTransformer.sortData(dataArray, sortByKey, isAscending);
```

Methods

sortData(data, sortBy, ascending)

data: Array of objects to be sorted.

sortBy: Key in the objects to sort by.

ascending: Boolean indicating whether the sort should be ascending (true) or descending (false). Defaults to true.
Returns the sorted array of objects.

Examples
Simulating Energy Consumption Data

```typescript
const hours = 24;
const peakHours = { start: 17, end: 21 };
const avgConsumption = { peak: 10, offPeak: 3 };
const energyData = DataSimulator.generateElectricityUnits(hours, peakHours, avgConsumption);
console.log(energyData);
```

Sorting Data

```typescript
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Carol', age: 35 }
];
const sortedUsers = DataTransformer.sortData(users, 'age');
console.log(sortedUsers);
```

Contributing
Contributions to improve the library are welcome. Please ensure that your code adheres to the existing style and that all tests pass.

License
This project is licensed under the MIT License.
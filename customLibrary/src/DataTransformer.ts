// Define a type `Sortable` which can be a string, number, or Date.
type Sortable = string | number | Date;

// Class `DataTransformer` with a static method for sorting data.
class DataTransformer {

  /**
   * Static method to sort an array of objects based on a specified property.
   * @param data - Array of objects to be sorted.
   * @param sortBy - The key in the object to sort by.
   * @param ascending - Boolean indicating if the sort should be ascending (default) or descending.
   * @returns The sorted array of objects.
   */
  static sortData<T extends Record<string, Sortable>>(data: T[], sortBy: keyof T, ascending: boolean = true): T[] {
      return data.sort((a, b) => {
        const valA = a[sortBy]; // Value of `sortBy` property in object `a`.
        const valB = b[sortBy]; // Value of `sortBy` property in object `b`.

        // Handle Date comparison
        if (valA instanceof Date && valB instanceof Date) {
          // Compare timestamps for Date objects.
          return ascending ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
        }

        // Handle string comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
          // Locale-specific string comparison.
          return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        // Handle number comparison
        if (typeof valA === 'number' && typeof valB === 'number') {
          // Numerical comparison.
          return ascending ? valA - valB : valB - valA;
        }

        // If none of the above types match, throw an error.
        throw new Error('Unsupported data type for sorting');
      });
    }
}

// Export the DataTransformer class for use in other modules.
export default DataTransformer;

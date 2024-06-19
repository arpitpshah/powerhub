"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataTransformer {
    static scaleData(data, scaleFactor) {
        return data.map(val => val * scaleFactor);
    }
    static normalizeData(data) {
        const max = Math.max(...data);
        const min = Math.min(...data);
        return data.map(val => (val - min) / (max - min));
    }
    static binningData(data, binSize) {
        const sortedData = [...data].sort((a, b) => a - b);
        const bins = [];
        for (let i = 0; i < sortedData.length; i += binSize) {
            const bin = sortedData.slice(i, i + binSize);
            bins.push(bin.reduce((acc, val) => acc + val, 0) / bin.length);
        }
        return bins;
    }
    static logTransform(data) {
        return data.map(val => Math.log(val + 1)); // Adding 1 to avoid log(0)
    }
    static sortData(data, sortBy, ascending = true) {
        return data.sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            // Handle Date comparison
            if (valA instanceof Date && valB instanceof Date) {
                return ascending ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
            }
            // Handle string comparison
            if (typeof valA === 'string' && typeof valB === 'string') {
                return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            // Handle number comparison
            if (typeof valA === 'number' && typeof valB === 'number') {
                return ascending ? valA - valB : valB - valA;
            }
            throw new Error('Unsupported data type for sorting');
        });
    }
}
exports.default = DataTransformer;

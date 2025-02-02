export const calculateAverage = (times: number[]): number => {
    if (times.length === 0) return 0;
    const total = times.reduce((acc, time) => acc + time, 0);
    return total / times.length;
  };
  
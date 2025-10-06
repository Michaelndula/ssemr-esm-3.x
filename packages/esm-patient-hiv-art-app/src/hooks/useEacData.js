import { useState, useEffect } from 'react';

const formatDateForApi = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const transformEacDataForChart = (apiData = []) => {
  const chartData = [];
  const monthOrder = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

  apiData.forEach(monthObject => {
    for (const [apiKey, value] of Object.entries(monthObject)) {
      const parts = apiKey.split(' ');
      const month = parts[0];
      const eacType = parts.slice(1).join(' ');
      chartData.push({
        key: month,
        group: eacType,
        value: value
      });
    }
  });

  chartData.sort((a, b) => monthOrder[a.key] - monthOrder[b.key]);
  return chartData;
};


export const useEacData = (initialDateRange) => {
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const startDate = formatDateForApi(dateRange[0]);
      const endDate = formatDateForApi(dateRange[1]);
      const apiUrl = `/openmrs/ws/rest/v1/ssemr/dashboard/completedEACSessions?startDate=${startDate}&endDate=${endDate}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        const result = await response.json();
        
        const transformedData = transformEacDataForChart(result.data);
        setChartData(transformedData);

      } catch (e) {
        console.error("Failed to fetch EAC data:", e);
        setError("Could not load chart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return { chartData, isLoading, error, dateRange, setDateRange };
};
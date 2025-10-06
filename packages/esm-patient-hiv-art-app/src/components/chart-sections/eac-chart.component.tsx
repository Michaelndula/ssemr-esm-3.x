import React from "react";
import { StackedBarChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import { DatePicker, DatePickerInput, SkeletonText, InlineNotification } from "@carbon/react";
import "@carbon/charts-react/styles.css";
import { useEacData } from "../../hooks/useEacData";

const chartOptions = {
  title: "Completed EAC Sessions by Month",
  axes: {
    bottom: {
      title: "Month",
      mapsTo: "key",
      scaleType: ScaleTypes.LABELS
    },
    left: {
      title: "Count of Sessions",
      mapsTo: "value",
      stacked: true
    },
  },
  height: "400px",
  color: {
    scale: { "EAC1": "#6929c4", "EAC2": "#1192e8", "EAC3": "#005d5d" }
  }
};

const EacChartsComponent = () => {
  const { chartData, isLoading, error, dateRange, setDateRange } = useEacData([
    new Date('2025-06-01'), 
    new Date()
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <h3>EAC Sessions Trend</h3>
      <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
        <DatePicker
          datePickerType="range"
          value={dateRange}
          onChange={(newRange) => setDateRange(newRange)}
          dateFormat="Y-m-d"
        >
          <DatePickerInput id="date-picker-start" placeholder="YYYY-MM-DD" labelText="Start date" />
          <DatePickerInput id="date-picker-end" placeholder="YYYY-MM-DD" labelText="End date" />
        </DatePicker>
      </div>
      
      {isLoading ? (
        <div style={{ height: "400px" }}>
            <SkeletonText paragraph={true} lineCount={4} />
        </div>
      ) : error ? (
        <InlineNotification kind="error" title="Error" subtitle={error} hideCloseButton />
      ) : chartData.length > 0 ? (
        <StackedBarChart data={chartData} options={chartOptions} />
      ) : (
        <div style={{ height: "400px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>No data available for the selected range.</p>
        </div>
      )}
    </div>
  );
};

export default EacChartsComponent;
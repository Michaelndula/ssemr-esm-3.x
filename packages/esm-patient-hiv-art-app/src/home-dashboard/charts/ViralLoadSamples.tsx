import React, { useContext } from "react";
import { LineChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import styles from "./index.scss";
import { Loading } from "@carbon/react";
import { DashboardContext } from "../context/DashboardContext";

const ViralLoadSamples = () => {
  const { viralLoadSamples, currentTimeFilter } = useContext(DashboardContext);

  const options = {
    title: "Viral load samples",
    axes: {
      bottom: {
        title: "",
        mapsTo: currentTimeFilter,
        scaleType: "labels",
      },
      left: {
        title: " Number of clients",
        mapsTo: "clients",
        scaleType: "linear",
      },
    },
    curve: "curveMonotoneX",
    height: "400px",
  };
  return (
    <div className={styles.chartContainer}>
      {viralLoadSamples?.processedChartData?.length > 0 &&
      viralLoadSamples?.processedChartData[0][currentTimeFilter] ? (
        <LineChart
          data={viralLoadSamples?.processedChartData}
          options={options}
        />
      ) : (
        <Loading className={styles.spinner} withOverlay={false} />
      )}
    </div>
  );
};

export default ViralLoadSamples;

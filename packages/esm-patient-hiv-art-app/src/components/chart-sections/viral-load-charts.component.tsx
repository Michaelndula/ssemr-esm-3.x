import React, { useContext, useEffect } from "react";
import "@carbon/charts-react/styles.css";
import { useCharts } from "../../hooks/useCharts";
import HivArtChartsLayoutComponent from "../../layouts/hiv-art-charts-layout.component";
import { DashboardContext } from "../../context/DashboardContext";

import EacChartsComponent from "./eac-chart.component";


const ViralLoadChartsComponent = () => {
  const { viralLoadChartsConfig } = useCharts();
  const {
    time,
    memoizedVLChartRequests,
    viralLoadRange,
    memoizedHVLCascade,
    categoryFilter,
  } = useContext(DashboardContext);

  useEffect(() => {
    memoizedVLChartRequests();
  }, [categoryFilter, time]);

  useEffect(() => {
    memoizedHVLCascade();
  }, [viralLoadRange]);


  return (
    <>
      <HivArtChartsLayoutComponent
        config={viralLoadChartsConfig}
        styleKey="viral-load"
      />
      <div style={{ padding: "2rem", marginTop: "2rem" }}>
        <EacChartsComponent />
      </div>
    </>
  );
};

export default ViralLoadChartsComponent;
import React, { useContext } from "react";
import "@carbon/charts/styles.css";
import { ScaleTypes } from "../types";
import styles from "./styles/index.scss";
import { DashboardContext } from "../context/DashboardContext";
import { SimpleBarChart } from "@carbon/charts-react";
import WaterfallPicker from "../components/filter/waterfall-picker.component";
import { Loading } from "@carbon/react";

const Waterfall = () => {
  const {
    chartData: { waterfall },
  } = useContext(DashboardContext);

  const options = {
    title: "",
    axes: {
      left: {
        mapsTo: "value",
        includeZero: false,
      },
      bottom: {
        title: "",
        mapsTo: "group",
        scaleType: "labels" as ScaleTypes,
      },
    },
    color: {
      pairing: {
        option: 2,
      },
      scale: {
        TX_CURR: "#6929c4",
        "Transfer In": "#6929c4",
        TX_NEW: "#6929c4",
        TX_RTT: "#6929c4",
        "Potential TX_CURR": "#A9A9A9",
        "Transfer Out": "#ff8f00",
        TX_DEATH: "#ff8f00",
        "TX_ML_Self Transfer": "#ff8f00",
        "TX_ML_Refusal/Stopped": "#ff8f00",
        "TX_ML_IIT (on ART <3 mo)": "#ff8f00",
        "TX_ML_IIT (on ART 3+ mo)": "#ff8f00",
        Calculated: "#A9A9A9",
      },
    },
    curve: "curveMonotoneX",
    height: "600px",
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.waterfallHeaderContainer}>
        <p style={{ fontSize: "16px", fontWeight: "600" }}>Waterfall Chart</p>
        <div className={styles.waterfallFilterWrapper}>
          <WaterfallPicker />
        </div>
      </div>
      {waterfall.loading ? (
        <Loading className={styles.spinner} withOverlay={false} />
      ) : (
        <SimpleBarChart
          options={options}
          data={waterfall?.processedChartData}
        />
      )}
    </div>
  );
};

export default Waterfall;

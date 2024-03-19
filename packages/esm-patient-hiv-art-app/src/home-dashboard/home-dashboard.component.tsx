import React, { useContext } from "react";
import { Home } from "@carbon/react/icons";
import styles from "./home-dashboard.scss";
import { useTranslation } from "react-i18next";
import StatCard from "./components/cards/StatCard";
import { Dropdown } from "@carbon/react";
import "@carbon/charts/styles.css";
import NewlyEnrolled from "./charts/NewlyEnrolled";
import SSEMRTab from "./components/tabs/SSEMRTab";
import CurrentlyEnrolled from "./charts/CurrentArtClients";
import ActiveClients from "./charts/ActiveClients";
import AdultARTRegimen from "./charts/AdultArtRegimen";
import ChildArtRegimen from "./charts/ChildArtRegimen";
import UnderCommunityCare from "./charts/UnderCommunityCare";
import DueForViralLoad from "./charts/DueForViralLoad";
import ViralLoadSamples from "./charts/ViralLoadSamples";
import ViralLoadCoverage from "./charts/ViralLoadCoverage";
import ViralLoadSuppression from "./charts/ViralLoadSuppression";
import HighViralLoadCascade from "./charts/HighViralLoadCascade";
import ChartCard from "./components/cards/ChartCard";
import { DashboardContext, filterOptions } from "./context/DashboardContext";
import ViralLoadResults from "./charts/ViralLoadResults";
import Waterfall from "./charts/Waterfall";

const HomeDashboard = () => {
  const { t } = useTranslation();

  const { setCurrentTimeFilter, stats, filterTabs, currentTopFilterIndex } =
    useContext(DashboardContext);

  return (
    <>
      {/* ................Title......................... */}
      <div className={styles.header}>
        <div className={styles["left-justified-items"]}>
          <Home color="green" size="34" className={styles.homeIcon} />
          <div className={styles["page-labels"]}>
            <p className={styles.title}>
              {t("hivCareAndART", "HIV Care and ART")}
            </p>
            <p className={styles.subTitle}>{t("dashboard", "Dashboard")}</p>
          </div>
        </div>
      </div>
      <div className={styles.parent}>
        {/* ..................Tabs................. */}
        <div className={styles.tabs}>
          {filterTabs.map((item) => (
            <SSEMRTab
              index={item.index}
              name={item.title}
              key={item.title}
              handler={item.filterFunction}
              isActive={currentTopFilterIndex == item.index}
            />
          ))}
          <div
            style={{
              width: 400,
            }}
          >
            <Dropdown
              id="filter"
              titleText=""
              initialSelectedItem={filterOptions[0]}
              onChange={(evt) => {
                setCurrentTimeFilter(evt.selectedItem.value);
              }}
              label=""
              items={filterOptions}
              itemToString={(item) => item.name}
            />
          </div>
        </div>

        {/* ...................Stats.................... */}
        <div className={styles.stats}>
          {stats.map((stat) => (
            <StatCard item={stat} key={stat.title} />
          ))}
        </div>

        {/* ...............Charts....................... */}
        <div className={styles.chartWrapper}>
          <ChartCard>
            <NewlyEnrolled />
          </ChartCard>
          <ChartCard>
            <CurrentlyEnrolled />
          </ChartCard>
          <ChartCard>
            <ActiveClients />
          </ChartCard>
        </div>

        {/* ...............Charts....................... */}
        <div className={styles.chartWrapper}>
          <ChartCard>
            <AdultARTRegimen />
          </ChartCard>
          <ChartCard>
            <ChildArtRegimen />
          </ChartCard>
          <ChartCard>
            <UnderCommunityCare />
          </ChartCard>
        </div>

        <ChartCard>
          <Waterfall />
        </ChartCard>

        {/* ...............Charts....................... */}
        <div className={styles.twoGridChartWrapper}>
          <ChartCard>
            <DueForViralLoad />
          </ChartCard>
          <ChartCard>
            <ViralLoadSamples />
          </ChartCard>
        </div>

        {/* ...............Charts....................... */}
        <div className={styles.chartWrapper}>
          <ChartCard>
            <ViralLoadResults />
          </ChartCard>
          <ChartCard>
            <ViralLoadCoverage />
          </ChartCard>
          <ChartCard>
            <ViralLoadSuppression />
          </ChartCard>
        </div>

        <ChartCard>
          <HighViralLoadCascade />
        </ChartCard>
      </div>
    </>
  );
};

export default HomeDashboard;

import React, { createContext, useEffect, useState } from "react";
import {
  adultArtDummy,
  childArtDummy,
  dummy,
  highViralLoadDummy,
} from "../dummy/data";
import { useFetch } from "../../hooks/useFetch";

export const filterOptions = [
  {
    name: "Year",
    value: "groupYear",
  },
  {
    name: "Month",
    value: "groupMonth",
  },
  {
    name: "Week",
    value: "groupWeek",
  },
];

export const DashboardContext = createContext(null);

const DashboardProvider = ({ children }) => {
  const [currentTimeFilter, setCurrentTimeFilter] = useState(
    filterOptions[0].value
  );
  const [currentTopFilterIndex, setCurrentTopFilterIndex] = useState(0);
  const [filters, setFilters] = useState(filterOptions[0].value);

  const { makeRequest } = useFetch();

  const [activeClients, setActiveClients] = useState({
    raw: null,
    processedChartData: [],
  });
  const [allClients, setAllClients] = useState({
    raw: null,
    processedChartData: [],
  });
  const [newlyEnrolledClients, setNewlyEnrolledClients] = useState({
    raw: null,
    processedChartData: [],
  });
  const [onAppointment, setOnAppointment] = useState({
    raw: null,
    processedChartData: [],
  });
  const [missedAppointment, setMissedAppointment] = useState({
    raw: null,
    processedChartData: [],
  });
  const [interrupted, setInterrupted] = useState({
    raw: null,
    processedChartData: [],
  });
  const [returned, setReturned] = useState({
    raw: null,
    processedChartData: [],
  });
  const [dueForViralLoad, setDueForViralLoad] = useState({
    raw: null,
    processedChartData: [],
  });
  const [adultART, setAdultART] = useState({
    raw: null,
    processedChartData: [],
  });
  const [childART, setChildART] = useState({
    raw: null,
    processedChartData: [],
  });
  const [viralLoadSamples, setViralLoadSamples] = useState({
    raw: null,
    processedChartData: [],
  });
  const [viralLoadResults, setViralLoadResults] = useState({
    raw: null,
    processedChartData: [],
  });
  const [highViralLoad, setHighViralLoad] = useState({
    raw: null,
    processedChartData: [],
  });

  const formatDataAgainstTime = (data) => {
    const bottomAxesArray = Object.keys(data?.summary[currentTimeFilter]);

    const formattedData = bottomAxesArray.map((item) => {
      const returnObject = {};
      returnObject[currentTimeFilter] = item;
      returnObject["clients"] = data?.summary[currentTimeFilter][item];

      return returnObject;
    });

    return formattedData;
  };

  const formatViralLoadData = (data) => {
    const processedData = data?.summary?.groupYear?.map((item) => {
      const keys = Object.keys(item);
      return {
        value: item[keys[0]],
        group: keys[0],
      };
    });
    return processedData;
  };

  const getClientData = async ({ url, params = "", onResult }) => {
    try {
      await makeRequest(url + params, onResult);
    } catch (e) {
      return e;
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const thirtyDaysAgo = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return formatDate(thirtyDaysAgo);
  };

  /**
   * AJAX requests defined here to avoid repeating them in individual components
   */
  const getActiveClients = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/activeClients",
      onResult(responseData, error) {
        if (responseData) {
          setActiveClients((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setActiveClients((prev) => ({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          }));
          return error;
        }
      },
    });
  };

  const getAllClients = async () => {
    await getClientData({
      url: "/ws/fhir2/R4/Patient",
      onResult: (responseData, error) => {
        if (responseData) {
          setAllClients(responseData);
        }
        if (error) return error;
      },
    });
  };

  const getNewlyEnrolledClients = async () => {
    await getClientData({
      url: `/ws/rest/v1/ssemr/dashboard/newClients?startDate=${thirtyDaysAgo()}&endDate=${formatDate(
        new Date()
      )}`,
      onResult: (responseData, error) => {
        if (responseData) {
          setNewlyEnrolledClients((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setNewlyEnrolledClients((prev) => ({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          }));
          return error;
        }
      },
    });
  };

  const getClientsOnAppointment = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/activeClients",
      onResult: (responseData, error) => {
        if (responseData) {
          setOnAppointment({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          });
        }
        if (error) {
          setOnAppointment({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          });
          return error;
        }
      },
    });
  };

  const getMissedAppointments = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/missedAppointment",
      onResult: (responseData, error) => {
        if (responseData) {
          setMissedAppointment({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          });
        }
        if (error) {
          setMissedAppointment({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          });
          return error;
        }
      },
    });
  };

  const getInterruptedTreatment = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/interruptedInTreatment",
      onResult: (responseData, error) => {
        if (responseData) {
          setInterrupted({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          });
        }
        if (error) {
          setInterrupted({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          });
          return error;
        }
      },
    });
  };

  const getReturnedToTreatment = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/returnToTreatment",
      onResult: (responseData, error) => {
        if (responseData) {
          setReturned({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          });
        }
        if (error) {
          setReturned({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          });
          return error;
        }
      },
    });
  };

  const getDueForViralLoad = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/dueForVl",
      onResult: (responseData, error) => {
        if (responseData) {
          setDueForViralLoad((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setDueForViralLoad((prev) => ({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          }));
          return error;
        }
      },
    });
  };

  const getViralLoadSamples = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/dueForVl",
      onResult: (responseData, error) => {
        if (responseData) {
          setViralLoadSamples((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setViralLoadSamples((prev) => ({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          }));
          return error;
        }
      },
    });
  };

  const getViralLoadResults = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/dueForVl",
      onResult: (responseData, error) => {
        if (responseData) {
          setViralLoadResults((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setViralLoadResults((prev) => ({
            raw: dummy,
            processedChartData: formatDataAgainstTime(dummy),
          }));
          return error;
        }
      },
    });
  };

  const getHighViralLoad = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/highVl",
      onResult: (responseData, error) => {
        if (responseData) {
          setHighViralLoad((prev) => ({
            raw: responseData,
            processedChartData: formatViralLoadData(responseData),
          }));
        }
        if (error) {
          setHighViralLoad((prev) => ({
            raw: dummy,
            processedChartData: formatViralLoadData(highViralLoadDummy),
          }));
          return error;
        }
      },
    });
  };

  const getAdultART = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/adultART",
      onResult: (responseData, error) => {
        if (responseData) {
          setAdultART((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setAdultART((prev) => ({
            raw: adultArtDummy,
            processedChartData: formatDataAgainstTime(adultArtDummy),
          }));
          return error;
        }
      },
    });
  };

  const getChildART = async () => {
    await getClientData({
      url: "/ws/rest/v1/ssemr/dashboard/childART",
      onResult: (responseData, error) => {
        if (responseData) {
          setChildART((prev) => ({
            raw: responseData,
            processedChartData: formatDataAgainstTime(responseData),
          }));
        }
        if (error) {
          setChildART((prev) => ({
            raw: childArtDummy,
            processedChartData: formatDataAgainstTime(childArtDummy),
          }));
          return error;
        }
      },
    });
  };

  const getStat = (dataSet) => {
    const filteredSet = dataSet?.filter((item) =>
      filterTabs[currentTopFilterIndex].filterFunction(item)
    );

    return filteredSet?.length;
  };

  const filterTabs = [
    {
      index: 0,
      title: "All clients",
      filterFunction: (item) => item,
    },
    {
      index: 1,
      title: "Children and adolescent",
      filterFunction: (item) => item.childOrAdolescent,
    },
    {
      index: 2,
      title: "pregnant and Breastfeeding Women",
      filterFunction: (item) => item.pregnantAndBreastfeeding,
    },
    {
      index: 3,
      title: "Clients returning from interrupted treatment",
      filterFunction: (item) => item.returningFromIT,
    },
    {
      index: 4,
      title: "Return to treatment",
      filterFunction: (item) => item.returningToTreatment,
    },
  ];

  const filterStatData = (stat) => {
    return stat?.filter(filterTabs[currentTopFilterIndex].filterFunction);
  };

  const stats = [
    {
      title: "Newly enrolled clients",
      stat: getStat(newlyEnrolledClients?.raw?.results),
      results: filterStatData(newlyEnrolledClients?.raw?.results),
    },
    {
      title: "Active clients (TX_CURR)",
      stat: getStat(activeClients?.raw?.results),
      results: filterStatData(activeClients?.raw?.results),
    },
    {
      title: "On appointment",
      stat: getStat(onAppointment?.raw?.results),
      results: filterStatData(onAppointment?.raw?.results),
    },
    {
      title: "Missed appointments",
      stat: getStat(missedAppointment?.raw?.results),
      results: filterStatData(missedAppointment?.raw?.results),
    },
    {
      title: "Interruptions in Treatment(Iit)",
      stat: getStat(interrupted?.raw?.results),
      results: filterStatData(interrupted?.raw?.results),
    },
    {
      title: "Returned to Treatment(Tx_Rtt)",
      stat: getStat(returned?.raw?.results),
      results: filterStatData(returned?.raw?.results),
    },
    {
      title: "Due for viral load",
      stat: getStat(dueForViralLoad?.raw?.results),
      results: filterStatData(dueForViralLoad?.raw?.results),
    },
    {
      title: "High viral load",
      stat: getStat(highViralLoad?.raw?.results),
      results: filterStatData(highViralLoad?.raw?.results),
    },
  ];

  useEffect(() => {
    getHighViralLoad();
    getDueForViralLoad();
    getNewlyEnrolledClients();
    getClientsOnAppointment();
    getActiveClients();
    getMissedAppointments();
    getAllClients();
    getReturnedToTreatment();
    getInterruptedTreatment();
    getViralLoadSamples();
    getViralLoadResults();
    getChildART();
    getAdultART();
  }, [currentTimeFilter]);

  return (
    <DashboardContext.Provider
      value={{
        activeClients,
        allClients,
        currentTimeFilter,
        currentTopFilterIndex,
        dueForViralLoad,
        filterTabs,
        filters,
        highViralLoad,
        interrupted,
        missedAppointment,
        newlyEnrolledClients,
        onAppointment,
        returned,
        setCurrentTimeFilter,
        setCurrentTopFilterIndex,
        setFilters,
        stats,
        viralLoadResults,
        viralLoadSamples,
        childART,
        adultART,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
export default DashboardProvider;

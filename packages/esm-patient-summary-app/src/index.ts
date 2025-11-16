import {
  defineConfigSchema,
  getSyncLifecycle,
  registerBreadcrumbs,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { dashboardMeta } from "./dashboard.meta";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";
import carePanelComponent from "./patient-summary-widget/care-panel.component";
import carePanelPatientSummaryComponent from "./patient-summary/patient-summary.component";
import VlPanelComponent from "./vl-history-widget/vl-panel.component";
import CommunityLinkagePanelComponent from "./community-linkage-widget/community-linkage-panel.component";
import ClientFamilyInfoPanelComponent from "./family-history-information-widget/more-client-info-panel.component";
import IndexFamilyHistoryPanelComponent from "./index-family-history-information-widget/index-family-history-panel.component";
import ViralLoadEligibility from "./viral-load-eligibility/viral-load-sample-eligibility.component";

const moduleName = "@ssemr/esm-patient-panel-app";

const options = {
  featureName: "patient-summary",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  registerBreadcrumbs([]);
  defineConfigSchema(moduleName, configSchema);
}

export const carePanelPatientSummary = getSyncLifecycle(
  carePanelPatientSummaryComponent,
  options
);

export const patientProgramSummary = getSyncLifecycle(
  carePanelComponent,
  options
);

export const patientVlhistory = getSyncLifecycle(VlPanelComponent, options);

export const PatientViralLoadEligibility = getSyncLifecycle(
  ViralLoadEligibility,
  options
);

export const patientData = getSyncLifecycle(
  ClientFamilyInfoPanelComponent,
  options
);

export const linkageToCHW = getSyncLifecycle(
  CommunityLinkagePanelComponent,
  options
);

export const indexFamilyHistory = getSyncLifecycle(
  IndexFamilyHistoryPanelComponent,
  options
);

// t('carePanel', 'Care panel')
export const carePanelSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta, moduleName }),
  options
);

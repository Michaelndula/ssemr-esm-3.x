import { Type } from "@openmrs/esm-framework";

export interface CarePanelConfig {
  regimenObs: {
    encounterProviderRoleUuid: string;
  };
}

export const configSchema = {
  concepts: {
    dateCollected: {
      type: Type.ConceptUuid,
      _default: "fc684917-4deb-42cf-9245-8a13c6a232bc",
    },
    dateVLResultsReceived: {
      type: Type.ConceptUuid,
      _default: "80e34f1b-26e8-49ea-9b6e-d7d903a91e26",
    },
    viralLoadValue: {
      type: Type.ConceptUuid,
      _default: "01c3ce55-b7eb-45f5-93d5-bace353e3cfd",
    },
  },
  viralLoad: {
    useFormEngine: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to use an Ampath form as the vitals and biometrics form. If set to true, encounterUuid and formUuid must be set as well.",
    },
    encounterTypeUuid: {
      _type: Type.UUID,
      _default: "e8481555-9dd1-4bb5-ba8c-cb721dafb166",
    },
    formUuid: {
      _type: Type.UUID,
      _default: "0ea6b2d5-28cc-3a65-9155-b60e0c09d118",
    },
    formName: {
      _type: Type.String,
      _default: "F. 8 - Follow up",
    },
  },
  regimenObs: {
    encounterProviderRoleUuid: {
      _type: Type.UUID,
      _default: "a0b03050-c99b-11e0-9572-0800200c9a66",
      _description:
        "The provider role to use for the regimen encounter. Default is 'Unkown'.",
    },
  },
};

export interface ConfigObject {
  concepts: {
    dateCollected: string;
    dateVLResultsReceived: string;
    viralLoadValue: string;
  };
  viralLoad: {
    useFormEngine: boolean;
    encounterTypeUuid: string;
    formUuid: string;
    formName: string;
  };
}

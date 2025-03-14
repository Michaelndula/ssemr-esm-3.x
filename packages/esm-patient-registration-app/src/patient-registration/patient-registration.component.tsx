import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import classNames from "classnames";
import { Button, Link, InlineLoading } from "@carbon/react";
import { XAxis } from "@carbon/react/icons";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, FormikHelpers } from "formik";
import {
  createErrorHandler,
  showSnackbar,
  useConfig,
  interpolateUrl,
  usePatient,
} from "@openmrs/esm-framework";
import { validationSchema as initialSchema } from "./validation/patient-registration-validation";
import { FormValues, CapturePhotoProps } from "./patient-registration.types";
import { PatientRegistrationContext } from "./patient-registration-context";
import { SavePatientForm, SavePatientTransactionManager } from "./form-manager";
import {
  updatePatientIdentifier,
  usePatientPhoto,
} from "./patient-registration.resource";
import { DummyDataInput } from "./input/dummy-data/dummy-data-input.component";
import {
  cancelRegistration,
  filterUndefinedPatientIdenfier,
  scrollIntoView,
} from "./patient-registration-utils";
import {
  useInitialAddressFieldValues,
  useInitialFormValues,
  usePatientUuidMap,
} from "./patient-registration-hooks";
import { ResourcesContext } from "../offline.resources";
import {
  builtInSections,
  RegistrationConfig,
  SectionDefinition,
} from "../config-schema";
import { SectionWrapper } from "./section/section-wrapper.component";
import BeforeSavePrompt from "./before-save-prompt";
import styles from "./patient-registration.scss";
import { CustomFieldsContext } from "./CustomFieldsContext";

let exportedInitialFormValuesForTesting = {} as FormValues;

export interface PatientRegistrationProps {
  savePatientForm: SavePatientForm;
  isOffline: boolean;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  savePatientForm,
  isOffline,
}) => {
  const { currentSession, identifierTypes } = useContext(ResourcesContext);

  const { artNumber } = useContext(CustomFieldsContext);

  const { search } = useLocation();

  const config = useConfig() as RegistrationConfig;

  const [target, setTarget] = useState<undefined | string>();

  const [validationSchema, setValidationSchema] = useState(initialSchema);

  const { patientUuid: uuidOfPatientToEdit } = useParams();

  const { isLoading: isLoadingPatientToEdit, patient: patientToEdit } =
    usePatient(uuidOfPatientToEdit);

  const { t } = useTranslation();

  const [capturePhotoProps, setCapturePhotoProps] =
    useState<CapturePhotoProps | null>(null);

  const [initialFormValues, setInitialFormValues] =
    useInitialFormValues(uuidOfPatientToEdit);

  const [initialAddressFieldValues] =
    useInitialAddressFieldValues(uuidOfPatientToEdit);

  const [patientUuidMap] = usePatientUuidMap(uuidOfPatientToEdit);

  const location = currentSession?.sessionLocation?.display;

  const inEditMode = isLoadingPatientToEdit
    ? undefined
    : !!(uuidOfPatientToEdit && patientToEdit);

  const showDummyData = useMemo(
    () => localStorage.getItem("openmrs:devtools") === "true" && !inEditMode,
    [inEditMode]
  );

  const { data: photo } = usePatientPhoto(patientToEdit?.id);

  const savePatientTransactionManager = useRef(
    new SavePatientTransactionManager()
  );

  useEffect(() => {
    exportedInitialFormValuesForTesting = initialFormValues;
  }, [initialFormValues]);

  const sections: Array<SectionDefinition> = useMemo(() => {
    return config.sections
      .map(
        (sectionName) =>
          config.sectionDefinitions.filter((s) => s.id == sectionName)[0] ??
          builtInSections.filter((s) => s.id == sectionName)[0]
      )
      .filter((s) => s);
  }, [config.sections, config.sectionDefinitions]);

  /**
   * Submit handler for the registration form
   * @param values
   * @param helpers
   */
  const onFormSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const abortController = new AbortController();
    helpers.setSubmitting(true);

    const artObject = {
      identifierTypeUuid: "e6baf185-38ed-4815-9476-f98d2cc2b331",
      identifierName: "Unique ART Number",
      preferred: false,
      initialValue: "",
      required: false,
      identifierValue: artNumber.identifierValue,
      selectedSource: {
        name: "",
        autoGeneration: "",
        uuid: "",
      },
      ...(artNumber?.identifierUuid?.length > 0 && {
        identifierUuid: artNumber.identifierUuid,
      }),
    };

    const filteredValues = filterUndefinedPatientIdenfier(values.identifiers);
    /**
     * If there's an identifier uuid in context that means this is an existing ART number and we need to update it instead of adding it.
     */
    if (artNumber.identifierUuid) {
      try {
        const res = await updatePatientIdentifier(
          uuidOfPatientToEdit,
          artNumber.identifierUuid,
          artNumber.identifierValue
        );
      } catch (e) {
        showSnackbar({
          title: "An error occured",
          subtitle: e?.message,
          kind: "error",
        });
      }
    } else {
      filteredValues["uniqueArtNumber"] = artObject;
    }

    const updatedFormValues = {
      ...values,
      identifiers: filteredValues,
    };
    try {
      const res = await savePatientForm(
        !inEditMode,
        updatedFormValues,
        patientUuidMap,
        initialAddressFieldValues,
        capturePhotoProps,
        location,
        initialFormValues["identifiers"],
        currentSession,
        config,
        savePatientTransactionManager.current,
        abortController
      );

      showSnackbar({
        subtitle: inEditMode
          ? t(
              "updatePatientSuccessSnackbarSubtitle",
              "The patient's information has been successfully updated"
            )
          : t(
              "registerPatientSuccessSnackbarSubtitle",
              "The patient can now be found by searching for them using their name or ID number"
            ),
        title: inEditMode
          ? t("updatePatientSuccessSnackbarTitle", "Patient Details Updated")
          : t("registerPatientSuccessSnackbarTitle", "New Patient Created"),
        kind: "success",
        isLowContrast: true,
      });

      const afterUrl = new URLSearchParams(search).get("afterUrl");
      const redirectUrl = interpolateUrl(
        afterUrl || config.links.submitButton,
        { patientUuid: values.patientUuid }
      );

      setTarget(redirectUrl);
    } catch (error) {
      if (error.responseBody?.error?.globalErrors) {
        error.responseBody.error.globalErrors.forEach((error) => {
          showSnackbar({
            title: inEditMode
              ? t(
                  "updatePatientErrorSnackbarTitle",
                  "Patient Details Update Failed"
                )
              : t(
                  "registrationErrorSnackbarTitle",
                  "Patient Registration Failed"
                ),
            subtitle: error.message,
            kind: "error",
          });
        });
      } else if (error.responseBody?.error?.message) {
        showSnackbar({
          title: inEditMode
            ? t(
                "updatePatientErrorSnackbarTitle",
                "Patient Details Update Failed"
              )
            : t(
                "registrationErrorSnackbarTitle",
                "Patient Registration Failed"
              ),
          subtitle: error.responseBody.error.message,
          kind: "error",
        });
      } else {
        createErrorHandler()(error);
      }

      helpers.setSubmitting(false);
    }
  };

  const displayErrors = (errors) => {
    if (errors && typeof errors === "object" && !!Object.keys(errors).length) {
      Object.keys(errors).forEach((error) => {
        showSnackbar({
          subtitle: t(`${error}LabelText`, error),
          title: t("incompleteForm", "The following field has errors:"),
          kind: "warning",
          isLowContrast: true,
        });
      });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
    >
      {(props) => (
        <Form className={styles.form}>
          <BeforeSavePrompt when={props.dirty} redirect={target} />
          <div className={styles.formContainer}>
            <div>
              <div className={styles.stickyColumn}>
                <h4>
                  {inEditMode
                    ? t("edit", "Edit")
                    : t("createNew", "Create New")}{" "}
                  {t("patient", "Patient")}
                </h4>
                {showDummyData && (
                  <DummyDataInput setValues={props.setValues} />
                )}
                <p className={styles.label01}>{t("jumpTo", "Jump to")}</p>
                {sections.map((section) => (
                  <div
                    className={classNames(styles.space05, styles.touchTarget)}
                    key={section.name}
                  >
                    <Link
                      className={styles.linkName}
                      onClick={() => scrollIntoView(section.id)}
                    >
                      <XAxis size={16} />{" "}
                      {t(`${section.id}Section`, section.name)}
                    </Link>
                  </div>
                ))}
                <Button
                  className={styles.submitButton}
                  type="submit"
                  onClick={() =>
                    props.validateForm().then((errors) => displayErrors(errors))
                  }
                  // Current session and identifiers are required for patient registration.
                  // If currentSession or identifierTypes are not available, then the
                  // user should be blocked to register the patient.
                  disabled={
                    !currentSession || !identifierTypes || props.isSubmitting
                  }
                >
                  {props.isSubmitting ? (
                    <InlineLoading
                      className={styles.spinner}
                      description={`${t("submitting", "Submitting")} ...`}
                      iconDescription="submitting"
                      status="active"
                    />
                  ) : inEditMode ? (
                    t("updatePatient", "Update Patient")
                  ) : (
                    t("registerPatient", "Register Patient")
                  )}
                </Button>
                <Button
                  className={styles.cancelButton}
                  kind="tertiary"
                  onClick={cancelRegistration}
                >
                  {t("cancel", "Cancel")}
                </Button>
              </div>
            </div>
            <div className={styles.infoGrid}>
              <PatientRegistrationContext.Provider
                value={{
                  isLoading: isLoadingPatientToEdit,
                  identifierTypes: identifierTypes,
                  validationSchema,
                  setValidationSchema,
                  values: props.values,
                  inEditMode,
                  setFieldValue: props.setFieldValue,
                  setCapturePhotoProps,
                  currentPhoto: photo?.imageSrc,
                  isOffline,
                  initialFormValues: props.initialValues,
                  setInitialFormValues,
                }}
              >
                {sections.map((section, index) => (
                  <SectionWrapper
                    key={`registration-section-${section.id}`}
                    sectionDefinition={section}
                    index={index}
                  />
                ))}
              </PatientRegistrationContext.Provider>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

/**
 * @internal
 * Just exported for testing
 */
export { exportedInitialFormValuesForTesting as initialFormValues };

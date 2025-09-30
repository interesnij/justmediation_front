import React, {useEffect, useState} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { SignupLayout } from "layouts";
import { registerParalegal, uploadFiles } from "api";
import { useCommonUIContext } from "contexts";
import {
  FormInput,
  Folder,
  FolderItem,
  FormRadio,
  FormUpload,
  SignupBar,
  LinkButton,
  FormSelect,
  Button,
  FormPhoneInputWithValidation,
  FormCountrySelect,
  FormStateSelect,
} from "components";
import { useModal, useGraduationYears } from "hooks";
import { ParalegalRegisterDto } from "types";
import { isEqual, last, unset } from "lodash";
import CloseIcon from "assets/icons/close.svg";
import { ApplicationReceiveModal } from "modals";
import { acceptFileTypes, validatePhone } from "helpers";
import {useLocation} from "@reach/router";

export const VerificationFormSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  is_disciplined: Yup.boolean().required("This field is required"),
  practice_jurisdictions: Yup.array().of(
    Yup.object().shape({
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      number: Yup.string().required("Number is required"),
      year: Yup.number().min(1960).required("Year is required"),
    })
  ),
  registration_attachments: Yup.array()
    .min(1, "Attachments are required")
    .required(),
});

interface VerificationFormProps {
  onBack(): void;
  initData: ParalegalRegisterDto;
}
export const VerificationForm = ({
  onBack,
  initData,
}: VerificationFormProps) => {
  const search = new URLSearchParams(useLocation().search);
  const invite_uuid = search.get("invite");
  const verifyModal = useModal();
  const graduationYears = useGraduationYears();
  const { showErrorModal } = useCommonUIContext();
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);

  const addJurisdiction = (values, setFieldValue) => {
    const lastElement: any = last(values.practice_jurisdictions);
    if (
      lastElement.country &&
      lastElement.state &&
      lastElement.number &&
      lastElement.year
    ) {
      setFieldValue("practice_jurisdictions", [
        ...values.practice_jurisdictions,
        { country: "", state: "", number: "", year: "" },
      ]);
    }
  };
  const removeJurisdiction = (values, setFieldValue, index) => {
    if (values.practice_jurisdictions.length > 1) {
      values.practice_jurisdictions.splice(index, 1);
      setFieldValue("practice_jurisdictions", [
        ...values.practice_jurisdictions,
      ]);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <SignupLayout>
      <div className="label">Step 3 of 3</div>
      <div className="title">Verification Form</div>
      <div className="desc mx-auto mt-3">
        To become a verified attorney on JustLaw, we need to validate the
        following information. Everything you share is confidential.
      </div>
      <Formik
        initialValues={initData}
        validationSchema={VerificationFormSchema}
        onSubmit={async (values) => {
          unset(values, "avatar");
          // ошибка
          const attachments = await uploadFiles(
            values.registration_attachments || [],
            "attorney_registration_attachments",
            0
          );
          const formData = {
            ...values,
            registration_attachments: attachments,
          }
          try {
            const res = await registerParalegal(formData, invite_uuid);
            console.log("res", res);
            verifyModal.setOpen(true);
          } catch (error: any) {
            showErrorModal("Error", error);
          }
        }}
      >
        {({ errors, values, initialValues, setFieldValue, isSubmitting }) => {
          const hasChanged = initialValues.email
            ? false
            : isEqual(values, initialValues);
          const hasErrors = Object.keys(errors).length > 0;
          return (
            <Form>
              <Folder className="mt-4" label="Basic information">
                <FolderItem>
                  <div className="row">
                    <FormInput
                      className="col-md-6 mt-3"
                      label="First Name"
                      placeholder="Enter your first name"
                      isRequired
                      name="first_name"
                    />
                    <FormInput
                      className="col-md-6 mt-3"
                      label="Last Name"
                      placeholder="Enter your last name"
                      isRequired
                      name="last_name"
                    />
                    <FormPhoneInputWithValidation
                      className="col-12 mt-3"
                      label="Phone number"
                      name="phone"
                      validate={value => validatePhone(value, countryPhoneObject)}
                      getCountryPhoneObject={setCountryPhoneObject}
                      isRequired
                    />
                  </div>
                </FolderItem>
              </Folder>
              <Folder className="mt-4" label="Jurisdictions">
                <FolderItem>
                  {values.practice_jurisdictions.map((item, index) => (
                    <div className="d-flex w-100 mt-0" key={`${index}key`}>
                      <div className="flex-1">
                        <div className="row">
                          <FormCountrySelect
                            className="col-md-3 mt-2"
                            label="Country"
                            name={`practice_jurisdictions[${index}].country`}
                            placeholder="Select a Country"
                            isRequired
                          />
                          <FormStateSelect
                            className="col-md-3 mt-2"
                            placeholder="Select a state"
                            label="State"
                            name={`practice_jurisdictions[${index}].state`}
                            country={
                              values.practice_jurisdictions
                                ? values.practice_jurisdictions[
                                    index
                                  ].country.toString()
                                : ""
                            }
                            isRequired
                          />
                          <FormInput
                            className="col-md-3 mt-2"
                            label="Registration Number"
                            name={`practice_jurisdictions[${index}].number`}
                            placeholder="Enter Registration Number"
                            isRequired
                          />
                          <FormSelect
                            values={graduationYears}
                            className="col-md-3 mt-2"
                            label="Year Admitted"
                            name={`practice_jurisdictions[${index}].year`}
                            placeholder="Select a year"
                            isRequired
                          />
                        </div>
                      </div>
                      {values.practice_jurisdictions.length > 1 && (
                        <IconButton
                          className="mb-auto"
                          src={CloseIcon}
                          onClick={() =>
                            removeJurisdiction(values, setFieldValue, index)
                          }
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    className="mt-1"
                    icon="plus"
                    type="text"
                    onClick={() => addJurisdiction(values, setFieldValue)}
                  >
                    Add Jurisdiction
                  </Button>
                </FolderItem>
              </Folder>

              <Folder
                className="mt-4"
                label="Have you ever suspended, censured as a member of the legal or any other profession?"
              >
                <FolderItem>
                  <FormRadio
                    values={[
                      { title: "Yes", id: true },
                      { title: "No", id: false },
                    ]}
                    name="is_disciplined"
                  />
                  <div className="mt-4">
                    We will not share your response to app users. This is only
                    for verification purposes. *
                  </div>
                </FolderItem>
              </Folder>
              <Folder
                className="mt-4"
                label="Attach your Certification Document for Verification"
              >
                <FolderItem>
                  <FormUpload
                    label=""
                    buttonLabel="Select from computer"
                    name="registration_attachments"
                    isRequired
                    acceptFileTypes={acceptFileTypes}
                  />
                </FolderItem>
              </Folder>
              <SignupBar>
                <LinkButton onClick={onBack}>Go Back</LinkButton>
                <div className="ml-auto">
                  By submitting, you acknowledge that you have read the{" "}
                  <a href="/privacy-policy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                  and agree to the{" "}
                  <a href="/terms-of-use" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>
                  .
                </div>
                <Button
                  buttonType="submit"
                  className="ml-auto"
                  disabled={hasChanged || hasErrors}
                  isLoading={isSubmitting}
                >
                  Next
                </Button>
              </SignupBar>
            </Form>
          );
        }}
      </Formik>
      {
        verifyModal?.open &&
        <ApplicationReceiveModal {...verifyModal} />
      }
    </SignupLayout>
  );
};

const IconButton = styled.img`
  width: 20px;
  height: 20px;
  margin: 54px 20px auto 20px;
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;
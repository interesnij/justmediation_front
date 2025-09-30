import React, {useEffect, useState} from "react";
import { SignupLayout } from "layouts";
import { Formik, Form } from "formik";
import styled from "styled-components";
import { registerClient } from "api";
import { ClientRegisterDto } from "types";
import {useLocation} from "@reach/router";
import { useBasicDataContext, useCommonUIContext } from "contexts";
import {
  SignupBar,
  LinkButton,
  Button,
  FormPhoneInputWithValidation,
  Card,
  FormInput,
  Folder,
  FolderItem,
  FormCheckboxStr,
  FormCheckboxGroup,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
} from "components";
import { validatePhone } from "helpers";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useModal } from "hooks";
import { RegistrationReceiveModal } from "modals";

const validateSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  client_type: Yup.string(),
  organization_name: Yup.string().when("client_type", {
    is: (value: string) => value === "individual",
    then: Yup.string(),
    otherwise: Yup.string().required("Organization is required"),
  }),
  job: Yup.string().when("client_type", {
    is: (value: string) => value === "individual",
    then: Yup.string(),
    otherwise: Yup.string().required("Job is required"),
  }),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  zip_code: Yup.string().required("Zip code is required"),
  address1: Yup.string().required("Address Line 1 is required"),
  address2: Yup.string(),
  specialities: Yup.array().min(1, "Practice area is required"),
});

interface Props {
  onBack(): void;
  initData: ClientRegisterDto;
}

export const AdditionalInfoPage = ({ onBack, initData }: Props) => {
  const search = new URLSearchParams(useLocation().search);
  const invite_uuid = search.get("invite");
  const { showErrorModal } = useCommonUIContext();
  const { specialties } = useBasicDataContext();
  const verifyModal = useModal();
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);
  const [defaultPracticeAreas, setDefaultPracticeArea] = useState<any>([]);

  useEffect(() => {
    setDefaultPracticeArea(specialties.filter((i) => i.created_by === null))
  }, [specialties])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <SignupLayout>
      <div className="label">Step 2 of 2</div>
      <div className="title mb-4">Additional Information</div>
      <Formik
        initialValues={initData}
        validationSchema={validateSchema}
        onSubmit={async (values) => {

          const formData = values.client_type === "individual"
            ? { ...values, organization_name: "" }
            : values
          try {
            await registerClient(formData, invite_uuid);
            verifyModal.setOpen(true);
          } catch (error: any) {
            showErrorModal("Error", error);
          }
        }}
      >
        {({ values, errors, isSubmitting, initialValues }) => {
          const hasChanged = isEqual(values, initialValues);
          const hasErrors = Object.keys(errors).length > 0;
          console.log("errors", errors, values);
          return (
            <Form>
              <Card>
                <div className="d-flex">
                  <span className="my-1">
                    I am signing up as a company or organization
                  </span>
                  <CheckBoxContainer className="ml-auto">
                    <FormCheckboxStr
                      name="client_type"
                      values={["individual", "firm"]}
                    />
                  </CheckBoxContainer>
                </div>

                {values.client_type === "firm" && (
                  <div className="row mt-1">
                    <FormInput
                      className="col-6 mt-1"
                      label="Company Name"
                      placeholder="Enter your company name"
                      isRequired
                      name="organization_name"
                    />
                    <FormInput
                      className="col-6 mt-1"
                      label="Job Title"
                      placeholder="Enter your job title"
                      isRequired
                      name="job"
                    />
                  </div>
                )}
              </Card>
              <Folder className="mt-4" label="Contact Information">
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

                    <FormCountrySelect
                      className="col-6 mt-3"
                      label="Country"
                      placeholder="Select a country"
                      isRequired
                      name="country"
                    />
                    <FormPhoneInputWithValidation
                      className="col-6 mt-3"
                      label="Phone number"
                      name="phone"
                      validate={value => validatePhone(value, countryPhoneObject)}
                      getCountryPhoneObject={setCountryPhoneObject}
                      isRequired
                    />
                    <FormInput
                      className="col-md-6 mt-3"
                      label="Address Line 1"
                      placeholder="Address line 1"
                      isRequired
                      name="address1"
                    />
                    <FormInput
                      className="col-md-6 mt-3"
                      label="Address Line 2"
                      placeholder="Address line 2"
                      name="address2"
                    />
                    <FormStateSelect
                      className="col-md-3 mt-3"
                      label="State"
                      placeholder="Select state"
                      isRequired
                      country={values.country.toString()}
                      name="state"
                    />
                    <FormCitySelect
                      className="col-md-6 mt-3"
                      label="City"
                      placeholder="Enter city"
                      isRequired
                      name="city"
                      state={values.state.toString()}
                    />
                    <FormInput
                      className="col-md-3 mt-3"
                      label="Zip code"
                      placeholder="Enter zip code"
                      isRequired
                      name="zip_code"
                    />
                  </div>
                </FolderItem>
              </Folder>
              <Folder className="mt-4" label="Practice Areas">
                <FolderItem>
                  <FormCheckboxGroup name="specialities" values={defaultPracticeAreas} />
                </FolderItem>
              </Folder>
              <SignupBar>
                <LinkButton onClick={onBack}>Go Back</LinkButton>
                <div className="ml-auto">
                  By submitting, you acknowledge that you have read the{" "}
                  <a href="/privacy-policy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>{" "}
                  and agree to the{" "}
                  <a href="/terms-of-use" target="_blank" rel="noreferrer">
                    Terms of Service
                  </a>
                  .
                </div>
                <Button
                  className="ml-auto"
                  isLoading={isSubmitting}
                  disabled={hasChanged || hasErrors}
                  buttonType="submit"
                >
                  Sign Up
                </Button>
              </SignupBar>
            </Form>
          );
        }}
      </Formik>
      {
        verifyModal?.open &&
        <RegistrationReceiveModal {...verifyModal} />
      }
    </SignupLayout>
  );
};

const CheckBoxContainer = styled.div`
  margin-top: 3px;
`;

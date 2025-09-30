import React, { useState } from "react";
import {
  Button,
  FormInput,
  FormSelect,
  FormPhoneInput2,
  FormTextarea,
  FormCheckbox,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
} from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { inviteUserToAttorney } from "api";
import styled from "styled-components";
import { useCommonUIContext } from "contexts";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  middle_name: Yup.string(),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  phone: Yup.string(),
  state: Yup.string(),
  country: Yup.string(),
  city: Yup.string(),
  zip_code: Yup.string(),
  address: Yup.string(),
  user_type: Yup.string().required("This field is required"),
  note: Yup.string(),
  message: Yup.string(),
  is_represent_company: Yup.boolean(),
  organization_name: Yup.string().when("is_represent_company", {
    is: (value: Boolean) => value,
    then: Yup.string().required("Company name is required"),
    otherwise: Yup.string(),
  }),
});

interface Props {
  onClose?(): void;
  onAdd?(param?: any): void;
  userEmail?: string;
}

const clientTypeData = [
  {
    id: "client",
    title: "Client",
  },
  {
    id: "lead",
    title: "Lead",
  },
];

export const InviteNewUser = ({
  onClose = () => {},
  userEmail,
  onAdd = () => {},
}: Props) => {
  const {showErrorModal} = useCommonUIContext();
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <Container>
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          middle_name: "",
          email: userEmail,
          phone: "",
          country: "",
          state: "",
          city: "",
          user_type: "",
          address: "",
          note: "",
          message: "",
          organization: "",
          role: "",
          is_represent_company: false,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const res: any = await inviteUserToAttorney({
              ...values,
              client_type: values.user_type == "client" ? values.user_type : "lead",
            });
            if (res?.response?.status === 409) {
              setErrorMsg(res?.response?.data?.detail);
              return;
            }
            onAdd(res?.data);
          } catch (error: any) {
            showErrorModal("Error", error);
            setErrorMsg(
              error?.response?.data?.detail || error?.response?.data?.message
            );
          }
        }}
      >
        {({ errors, values, initialValues, isSubmitting }) => {
          const hasChanged = isEqual(values, initialValues);
          const hasErrors = Object.keys(errors).length > 0;
          return (
            <Form>
              <div className="row">
                <FormInput
                  label="First Name"
                  className="col-md-4"
                  name="first_name"
                  isRequired
                />
                <FormInput
                  label="Middle Name"
                  className="col-md-4"
                  name="middle_name"
                />
                <FormInput
                  label="Last Name"
                  className="col-md-4"
                  name="last_name"
                  isRequired
                />
                <FormInput
                  label="Email"
                  className="col-md-6 mt-2"
                  name="email"
                  isRequired
                />
                <FormPhoneInput2
                  label="Phone Number"
                  className="col-md-6 mt-2"
                  name="phone"
                />
                <FormCountrySelect
                  label="Country"
                  className="col-md-6 mt-2"
                  name="country"
                  placeholder="Select Country"
                />
                <FormInput
                  label="Address"
                  className="col-md-6 mt-2"
                  name="address"
                  placeholder="Enter address"
                />
                <FormStateSelect
                  label="State"
                  className="col-md-3 mt-2"
                  name="state"
                  placeholder="Select state"
                  country={values.country}
                />
                <FormCitySelect
                  label="City"
                  className="col-md-6 mt-2"
                  name="city"
                  placeholder="Enter city"
                  state={values.state}
                />
                <FormInput
                  label="Zip"
                  className="col-md-3 mt-2"
                  name="zip_code"
                  placeholder="Enter zip code"
                />
                <FormSelect
                  label="Client Type"
                  className="col-12 mt-2"
                  name="user_type"
                  placeholder="Select client type"
                  values={clientTypeData}
                  isRequired
                />
                <FormTextarea
                  label="Note"
                  className="col-12 mt-2"
                  name="note"
                  placeholder="Leave a note for yourself"
                />
                <FormCheckbox
                  className="col-12 mt-2"
                  name="is_represent_company"
                >
                  Represents a company
                </FormCheckbox>
                {values.is_represent_company && (
                  <>
                    <FormInput
                      label="Company Name"
                      className="col-md-6 mt-2"
                      name="organization_name"
                      placeholder="Enter company name"
                      isRequired
                    />
                    <FormInput
                      label="Role"
                      className="col-md-6 mt-2"
                      name="role"
                      placeholder="Enter role"
                    />
                  </>
                )}
                <FormTextarea
                  label="Invitation Message"
                  className="col-12 mt-2"
                  name="message"
                  placeholder="Enter message"
                />
              </div>
              {errorMsg && (
                <div className="mt-2 mb-3 text-red text-center font-size-md">
                  {errorMsg}
                </div>
              )}
              <div className="d-flex mt-2">
                <Button
                  buttonType="button"
                  className="ml-auto"
                  theme="white"
                  size="large"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  buttonType="submit"
                  className="ml-3"
                  disabled={hasChanged || hasErrors}
                  isLoading={isSubmitting}
                  size="large"
                >
                  Save Contact and Send Invitation
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

const Container = styled.div`
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px;
`;

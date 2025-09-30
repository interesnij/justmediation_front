import React, { useState, useEffect } from "react";
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
  Modal,
} from "components";
import { useAuthContext } from "contexts";
import { useInput } from "hooks";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { updateContact } from "api";
import styled from "styled-components";
import "./style.scss";

interface Props {
  data?: any;
  open: boolean;
  setOpen(param: boolean): void;
  onUpdate?(params?): void;
  isPending?: boolean;
  contactId?: string | number;
}

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  middle_name: Yup.string().nullable(),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  phone: Yup.string().nullable(),
  state: Yup.string(),
  country: Yup.string(),
  city: Yup.string(),
  zip_code: Yup.string(),
  address: Yup.string(),
  client_type: Yup.string().required("This field is required"),
  note: Yup.string().nullable(),
  is_represent_company: Yup.boolean(),
  organization_name: Yup.string().when("is_represent_company", {
    is: (value: Boolean) => value === true,
    then: Yup.string().required("Company name is required"),
    otherwise: Yup.string(),
  }),
});

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

export const EditContactModal = ({
  data,
  open,
  setOpen,
  onUpdate = () => {},
  isPending = false,
  contactId,
}: Props) => {
  let reset = () => {};
  const userEmail = useInput("");
  const [errorMsg, setErrorMsg] = useState("");
  const { userId } = useAuthContext();
  useEffect(() => {
    return () => {};
  }, [userEmail.value]);

  return (
    <Modal
      title="Edit Contact"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <Container>
        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setErrorMsg("");
            try {
              await updateContact(userId, {
                is_pending: isPending,
                contact_id: contactId,
                contact_data: values,
              });
              onUpdate();
              setOpen(false);
            } catch (error: any) {
              setErrorMsg(
                error?.response?.data?.detail || error?.response?.data?.message
              );
            }
          }}
        >
          {({ errors, values, initialValues, setFieldValue, isSubmitting }) => {
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
                    disabled={!isPending}
                  />
                  <FormInput
                    label="Middle Name"
                    className="col-md-4"
                    name="middle_name"
                    disabled={!isPending}
                  />
                  <FormInput
                    label="Last Name"
                    className="col-md-4"
                    name="last_name"
                    isRequired
                    disabled={!isPending}
                  />
                  <FormInput
                    label="Email"
                    className="col-md-6 mt-2"
                    name="email"
                    isRequired
                    disabled={!isPending}
                  />
                  <FormPhoneInput2
                    label="Phone Number"
                    className="col-md-6 mt-2"
                    name="phone"
                    disabled={!isPending}
                  />
                  <FormCountrySelect
                    label="Country"
                    className="col-md-6 mt-2"
                    name="country"
                    placeholder="Select Country"
                    disabled={!isPending}
                  />
                  <FormInput
                    label="Address"
                    className="col-md-6 mt-2"
                    name="address"
                    placeholder="Enter address"
                    disabled={!isPending}
                  />
                  <FormStateSelect
                    label="State"
                    className="col-md-3 mt-2"
                    name="state"
                    placeholder="Select state"
                    country={values.country}
                    disabled={!isPending}
                    selectedState={values.state}
                  />
                  <FormCitySelect
                    label="City"
                    className="col-md-6 mt-2"
                    name="city"
                    placeholder="Enter city"
                    state={values.state}
                    disabled={!isPending}
                    selectedCity={values.city}
                  />
                  <FormInput
                    label="Zip"
                    className="col-md-3 mt-2"
                    name="zip_code"
                    placeholder="Enter zip code"
                    disabled={!isPending}
                  />
                  <FormSelect
                    label="Client Type"
                    className="col-12 mt-2"
                    name="client_type"
                    placeholder="Select client type"
                    values={clientTypeData}
                    isRequired
                    disabled={!isPending}
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
                    disabled={!isPending}
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
                        disabled={!isPending}
                      />
                      <FormInput
                        label="Role"
                        className="col-md-6 mt-2"
                        name="role"
                        placeholder="Enter role"
                        disabled={!isPending}
                      />
                    </>
                  )}
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
                      setOpen(false);
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
                    Save Changes
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  width: 800px;
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px;
`;

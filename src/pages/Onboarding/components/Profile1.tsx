import React, {useEffect, useState} from "react";
import { navigate } from "@reach/router";
import {
  FormInput,
  Card,
  FormTextarea,
  FormProfilePhoto,
  Button,
  SignupBar,
  FormPhoneInputWithValidation,
  LinkButton
} from "components";
import { validatePhone } from "helpers";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import { MediatorRegisterDto } from "types";
import * as Yup from "yup";
import "./../style.scss";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  avatar: Yup.string().required("Photo is required"),
});

interface Props {
  onNext(params: MediatorRegisterDto): void;
  initData: MediatorRegisterDto;
  role?: string
}

export const ProfileForm1 = ({ onNext, initData, role }: Props) => {
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <Formik
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        onNext(values);
      }}
    >
      {({ errors, values, initialValues }) => {
        const hasChanged = initialValues.first_name
          ? false
          : isEqual(values, initialValues);
        const hasErrors = Object.keys(errors).length > 0;
        return (
          <Form>
            <Card className="p-4">
              <div className="row">
                <div className="col-12 ">
                  <div className="heading">Profile Photo</div>
                  <FormProfilePhoto name="avatar" className="mt-2" isRequired={false}/>
                </div>
                <div className="heading mt-3 col-12">Personal Information</div>
                <div className="d-flex w-100">
                  <div className="col-md-6 mt-3">
                    <FormInput
                      label="First Name"
                      isRequired
                      name="first_name"
                      placeholder="Enter first name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Middle Name"
                      name="middle_name"
                      placeholder="Enter middle name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Last Name"
                      isRequired
                      name="last_name"
                      placeholder="Enter last name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Email"
                      name="email"
                      isRequired
                      placeholder="Enter email here"
                    />
                    <FormPhoneInputWithValidation
                      className="mt-2"
                      label="Phone"
                      name="phone"
                      validate={value => validatePhone(value, countryPhoneObject)}
                      getCountryPhoneObject={setCountryPhoneObject}
                      isRequired
                    />
                  </div>
                  <div className="col-md-6 d-flex flex-column mt-3">
                    <FormTextarea
                      label="Biography"
                      placeholder="Describe your legal practice"
                      name="biography"
                      fluidHeight
                    />
                  </div>
                </div>
              </div>
            </Card>
            <SignupBar>
              {role === 'Mediator' && <LinkButton onClick={() => navigate(-1)}>Go Back</LinkButton>}
              {hasErrors ? (
                <div className="error-text ml-auto">{Object.values(errors)[0]}</div>
              ) : (
                <div className="ml-auto">
                  You can change your profile information at anytime under{" "}
                  <b>Edit Profile</b>
                </div>
              )}
              <Button
                className="ml-auto"
                buttonType="submit"
                disabled={hasChanged || hasErrors}
              >
                Next
              </Button>
            </SignupBar>
          </Form>
        );
      }}
    </Formik>
  );
};

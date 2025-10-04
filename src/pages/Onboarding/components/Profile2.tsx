import React, {useState, useEffect} from "react";
import {
  FormInput,
  Card,
  FormCitySelect,
  Button,
  SignupBar,
  LinkButton,
  FormCountrySelect,
  FormStateSelect,
} from "components";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import { MediatorRegisterDto } from "types";
import { last } from "lodash";
import styled from "styled-components";
import * as Yup from "yup";
import PlusIcon from "assets/icons/plus_black.svg";
import CloseIcon from "assets/icons/close.svg";
import "./../style.scss";

const validationSchema = Yup.object().shape({
  firm_name: Yup.string(),
  website: Yup.string().test(
    "website validation",
    "The website url format is invalid.",
    (param = "") => {
      if (param === "https://") return true;
      return /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/.test(
        param
      );
    }
  ),
  firm_locations: Yup.array().of(
    Yup.object().shape({
      country: Yup.string().required("Country is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip_code: Yup.string().required("Zip code is required"),
    })
  ),
});

interface Props {
  onBack(): void;
  onNext(params: MediatorRegisterDto): void;
  initData: MediatorRegisterDto;
}

export const ProfileForm2 = ({ onNext, onBack, initData }: Props) => {
  const [isShowingAlert, setShowingAlert] = useState(false);
  const addLocation = (values: any, setFieldValue: any) => {
    const lastElement: any = last(values.firm_locations);
    if (
      lastElement.country &&
      lastElement.state &&
      lastElement.city &&
      lastElement.zip_code &&
      lastElement.address
    ) {
      setFieldValue("firm_locations", [
        ...values.firm_locations,
        { country: "", state: "", city: "", zip_code: "", address: "" },
      ]);
    }
    else {
      setShowingAlert(true);
      setTimeout(() => {
        setShowingAlert(false)
      }, 2000);
    }
  };
  const removeLocation = (values: any, setFieldValue: any, index: any) => {
    if (values.firm_locations.length > 1) {
      values.firm_locations.splice(index, 1);
      setFieldValue("firm_locations", [...values.firm_locations]);
    }
  };
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
      {({ errors, values, initialValues, setFieldValue }) => {
        const hasChanged = initialValues.email
          ? false
          : isEqual(values, initialValues);
        const hasErrors = Object.keys(errors).length > 0;

        return (
          <Form>
            <Card className="p-4">
              <div className="row">
                <div className="heading w-100">
                  <div className="col-6 d-flex">
                    <span className="mb-1">Firm Name</span>
                    <div className="text-gray ml-auto mt-auto">Optional</div>
                  </div>
                </div>
                <FormInput
                  className="col-6"
                  placeholder="Enter a name"
                  name="firm_name"
                />
                <div className="mt-3 heading w-100">
                  <div className="col-6 d-flex">
                    <span className="mb-1">Website</span>
                    <div className="text-gray ml-auto mt-auto">Optional</div>
                  </div>
                </div>
                <FormInput
                  className="col-6"
                  placeholder="Enter a website"
                  name="website"
                />
                <div className="heading col-12 mt-3 mb-2">
                  Office Address
                  <span className="heading__desc ml-4">
                    JustMediation will use this address to match you with potential
                    clients in your proximity
                  </span>
                </div>
                {values.firm_locations?.map((item, index) => (
                  <div className="d-flex flex-column w-100 pt-2" key={`${index}key`}>
                    <div className="d-flex pr-3">
                      {values.firm_locations &&
                        values.firm_locations.length > 1 && (
                          <IconButton
                            className="ml-auto"
                            src={CloseIcon}
                            onClick={() =>
                              removeLocation(values, setFieldValue, index)
                            }
                          />
                        )}
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <FormCountrySelect
                          isRequired
                          className="col-md-4"
                          label="Country"
                          name={`firm_locations[${index}].country`}
                          placeholder="Select a Country"
                        />
                        <FormInput
                          className="col-md-8"
                          label="Address"
                          name={`firm_locations[${index}].address`}
                          placeholder="Enter an address here"
                          isRequired
                        />
                        <FormStateSelect
                          isRequired
                          className="col-md-4 mt-2"
                          label="State"
                          name={`firm_locations[${index}].state`}
                          placeholder="Select a State"
                          country={
                            values?.firm_locations
                              ? values?.firm_locations[index].country
                              : ""
                          }
                          selectedState={values?.firm_locations ? parseInt(values?.firm_locations[index].state) : undefined}
                        />
                        <FormCitySelect
                          isRequired
                          className="col-md-4 mt-2"
                          label="City"
                          name={`firm_locations[${index}].city`}
                          placeholder="Enter a city here"
                          state={
                            values.firm_locations
                              ? values.firm_locations[index].state
                              : ""
                          }
                          selectedCity={values?.firm_locations ? parseInt(values?.firm_locations[index].city) : undefined}
                        />
                        <FormInput
                          className="col-md-4 mt-2"
                          label="Zip code"
                          name={`firm_locations[${index}].zip_code`}
                          placeholder="Enter a zip code here"
                          isRequired
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="col-12 mt-2">
                  <div
                    className="add-button"
                    onClick={() => addLocation(values, setFieldValue)}
                  >
                    <img src={PlusIcon} alt="plus" />
                    Add an Office address
                  </div>
                  <span className={`error-text ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => {setShowingAlert(false)}}>Please input your Office</span>
                </div>
              </div>
            </Card>
            <SignupBar>
              <LinkButton onClick={onBack}>Go Back</LinkButton>
              <div className="ml-auto">
                You can change your profile information at anytime under{" "}
                <b>Edit Profile</b>
              </div>
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

const IconButton = styled.img`
  width: 20px;
  height: 20px;
  margin-top: 20px;
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;

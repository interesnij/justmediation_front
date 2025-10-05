import React, {useEffect, useState} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SignupLayout } from "layouts";
import { ApplicationReceiveModal } from "modals";
import { useBasicDataContext, useCommonUIContext } from "contexts";
import { isEqual, last } from "lodash";
import styled from "styled-components";
import {
  FormInput,
  Folder,
  FolderItem,
  FormSelect,
  FormRadio,
  Button,
  SignupBar,
  LinkButton, 
  FormPhoneInputWithValidation,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
} from "components";
import { validatePhone } from "helpers";
import { EnterpriseRegisterDto } from "types";
import { useModal } from "hooks";
import { registerEnterprise } from "api";
import PlusIcon from "assets/icons/plus_black.svg";
import CloseIcon from "assets/icons/close.svg";
import {useLocation} from "@reach/router";


const roleData = [ 
  {
    title: "Mediator",
    id: "Mediator",
  },
  {
    title: "Other (E.g. Accounting, HR, etc.)",
    id: "Other",
  },
];

export const schema = Yup.object().shape({
  role: Yup.string().required("Role is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  firm_size: Yup.string().required("Firm size is required"),
  firm_locations: Yup.array().of(
      Yup.object().shape({ 
        country: Yup.number()
          .min(1, "Country is required")
          .required("Country is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.number()
          .min(1, "State is required")
          .required("State is required"),
        zip_code: Yup.string().required("Zip code is required"),
      })
    ),
}); 

interface Props {
  onBack(): void; 
  initData: EnterpriseRegisterDto; 
} 

export const VerificationForm = ({ initData, onBack }: Props) => {
  initData.firm_locations = [{
    country : "1",
    state : "1",
    address : "",
    city : "1",
    zip_code : "",
  }];
  //const initData: EnterpriseRegisterDto = {
  //  first_name : "",
  //  last_name : "",
  //  email : "",
  //  phone : "",
  //  role : "",
  //  firm_size :"1",
  //  firm_locations : [{
  //    country : "1",
  //    state : "1",
  //    address : "",
  //    city : "1",
  //    zip_code : "",
  //  }],
  //};

  const verifyModal = useModal();
  const { firmSizes } = useBasicDataContext();
  const { showErrorModal } = useCommonUIContext();
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);
  const search = new URLSearchParams(useLocation().search);

  const addLocation = (values, setFieldValue) => {
    const lastElement: any = last(values.firm_locations);
    console.log("values", values);
    console.log("lastElement", lastElement);
    if (!lastElement) {
      setFieldValue("firm_locations", [
        ...values.firm_locations,
        {country: "", state: "", city: "", zip_code: "", address: ""},
      ]);
    } 
    else if (
      lastElement.country &&
      lastElement.state &&
      lastElement.city &&
      lastElement.zip_code &&
      lastElement.address
    ) {
      setFieldValue("firm_locations", [
        ...values.firm_locations,
        {country: "", state: "", city: "", zip_code: "", address: ""},
      ]);
    }
  };

  const removeLocation = (values, setFieldValue, index) => {
    if (values.firm_locations.length > 1) {
      values.firm_locations.splice(index, 1);
      setFieldValue("firm_locations", [...values.firm_locations]);
    } 
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <SignupLayout> 
      <div className="label">Step 2 of 2</div>
      <div className="title">Intake Form</div>
      <div className="desc mx-auto mt-3">
        To start your enterprise account, please enter your information below
        and our team will reach out to you shortly
      </div>
      <Formik
        initialValues={initData}
        validationSchema={schema}
        onSubmit={async (values) => {
          try { 
            await registerEnterprise(values);
            verifyModal.setOpen(true);
          } catch (error: any) {
            showErrorModal("Error", error);
          }
        }}
      >
        {({ isSubmitting, errors, values, initialValues, setFieldValue }) => {
          const hasChanged = isEqual(values, initialValues);
          const hasErrors = Object.keys(errors).length > 0;
          //values.firm_locations = {country: "", state: "", city: "", zip_code: "", address: ""};
          
          console.log(values);
          var state_int: string = "0";
          var country_int: string = "0";
          var city_int: string = "0";

          if (values && values.firm_locations && values.firm_locations[0].state) {
            state_int = values.firm_locations[0].state;
          }
          if (values && values.firm_locations && values.firm_locations[0].country) {
            country_int = values.firm_locations[0].country;
          }
          if (values && values.firm_locations && values.firm_locations[0].country) {
            city_int = values.firm_locations[0].city;
          }

          return (
            <Form>
              <div className="mt-4">
                  <div className="row">
                    <div className="col-12 d-flex mb-1">
                      <div className="text-black">What is your role?</div>
                      <div className="ml-4 my-auto input-control__required">
                        Required
                      </div>
                    </div>
                    <FormRadio
                      className="col-12"
                      values={roleData}
                      name="role"
                    />
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
                    <FormSelect
                      className="col-12 mt-3"
                      label="Firm Size"
                      placeholder="Select a firm size"
                      isRequired
                      values={firmSizes}
                      name="firm_size"
                    />
                    </div>
                
                 
                <div className="heading col-12 mt-3 mb-2"> 
                      Firm Location
                      <span className="heading__desc text-gray ml-4">
                        JustMediationHub will use this address to match you with potential
                        clients in your proximity
                      </span>
                    </div>
                    {values.firm_locations?.map((item, index) => (
                    <div className="d-flex flex-column w-100 pt-2"
                        key={`${index}key`}
                    >

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
                              value={1}
                            /> 
                            <FormStateSelect
                              isRequired
                              className="col-md-4 mt-2"
                              label="State"
                              name={`firm_locations[${index}].state`}
                              placeholder="Select a State"
                              country={country_int}
                              selectedState={Number(state_int)}
                            /> 
                            <FormCitySelect
                              isRequired
                              className="col-md-4 mt-2"
                              label="City" 
                              name={`firm_locations[${index}].city`}
                              placeholder="Enter a city here"
                              state={state_int}
                              selectedCity={Number(city_int)}
                              //selectedCity={values.firm_locations[index].city}
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
                        className="add-button cursor-pointer d-flex"
                        onClick={() => addLocation(values, setFieldValue)}
                      > 
                        <img src={PlusIcon} alt="plus"/>
                        <span className="my-auto ml-1">
                          Add an Firm Location
                        </span>
                      </div>
                    </div>
                </div> 

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
                  className="ml-auto"
                  isLoading={isSubmitting}
                  disabled={hasChanged || hasErrors}
                  buttonType="submit"
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
  margin-top: 20px;
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    opacity: 0.7;
  }
`;

const CloseButton = styled.img`
  width: 20px;
  height: 20px;
  margin: 54px 20px auto 20px;
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    opacity: 0.7;
  }
`;
import React, {useState, useEffect} from "react";
import {
  FormInput,
  Card,
  FormSelect,
  Button,
  SignupBar,
  FormCheckboxGroup,
  LinkButton,
  FormCountrySelect,
  FormStateSelect,
} from "components";
import { last } from "lodash";
import styled from "styled-components";
import { useGraduationYears } from "hooks";
import { AttorneyRegisterDto } from "types";
import { useBasicDataContext, useAuthContext } from "contexts";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PlusIcon from "assets/icons/plus_black.svg";

import CloseIcon from "assets/icons/close.svg";
import "./../style.scss";

interface Props {
  onBack(): void;
  onNext(params: AttorneyRegisterDto): void;
  initData: AttorneyRegisterDto;
}

export const ProfileForm3 = ({ onNext, onBack, initData }: Props) => {
  const graduationYears = useGraduationYears();
  const { specialties } = useBasicDataContext();
  const { userType } = useAuthContext();
  const [isShowingSchoolAlert, setShowingSchoolAlert] = useState(false);
  const [isShowingJurisdictionAlert, setShowingJurisdictionAlert] = useState(false);

  const validationSchema = Yup.object().shape({
    practice_jurisdictions:
      userType === "attorney"
        ? Yup.array().of(
            Yup.object().shape({
              country: Yup.string().required("Country is required"),
              state: Yup.string().required("State is required"),
              number: Yup.string().required("Registration number is required"),
              year: Yup.number()
                .min(1960, "Admitted Year is required")
                .required("Admitted Year is required"),
            })
          )
        : Yup.array()
            .min(0)
            .of(
              Yup.object().shape({
                country: Yup.number(),
                state: Yup.number(),
                number: Yup.string(),
                year: Yup.number(),
              })
            ),
    education: Yup.array().of(
      Yup.object().shape({
        university: Yup.string().required("Law school is required"),
        year: Yup.number()
          .min(1960, "Years of graduation is required")
          .required("Years of graduation is required"),
      })
    ),
    years_of_experience: Yup.number()
      .min(1, "Years of experience is required")
      .required("Years of experience is required"),
    specialities: Yup.array()
      .min(1, "Practice area is required")
      .required("Practice area is required"),
  });

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
    else {
      setShowingJurisdictionAlert(true);
      setTimeout(() => {
        setShowingJurisdictionAlert(false);
      }, 2000);
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

  const addEducation = (values, setFieldValue) => {
    const lastElement: any = last(values.education);
    if (lastElement.university && lastElement.year) {
      setFieldValue("education", [
        ...values.education,
        { university: "", year: "" },
      ]);
    }
    else {
      setShowingSchoolAlert(true);
      setTimeout(() => {
        setShowingSchoolAlert(false)
      }, 2000);
    }
  };
  const removeEducation = (values, setFieldValue, index) => {
    if (values.education.length > 1) {
      values.education.splice(index, 1);
      setFieldValue("education", [...values.education]);
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
        const hasErrors = Object.keys(errors).length > 0;
        const hasChanged = initialValues.years_of_experience
          ? false
          : isEqual(values, initialValues);
        return (
          <Form>
            <Card className="p-4">
              <div className="row">
                <div className="heading col-12">Education</div>
                {values.education?.map((item, index) => (
                  <div className="d-flex w-100 col-12 mt-0" key={`${index}key`}>
                    <div className="flex-1">
                      <div className="row">
                        <FormInput
                          className="col-md-6 mt-2"
                          label="Law school / Graduate Institute"
                          name={`education[${index}].university`}
                          placeholder="Enter a school / graduate institute name"
                          isRequired
                        />
                        <FormInput 
                            className="col-md-6 mt-2"
                            label="Year of graduation"
                            name={`education[${index}].year`}
                            placeholder="Year"
                            isRequired
                          />
                      </div>
                    </div>
                    {values.education && values.education.length > 1 && (
                      <IconButton
                        className="mb-auto my-auto"
                        src={CloseIcon}
                        onClick={() =>
                          removeEducation(values, setFieldValue, index)
                        }
                      />
                    )}
                  </div>
                ))}
                
                <div className="col-12 mt-2">
                  <div
                    className="add-button"
                    onClick={() => addEducation(values, setFieldValue)}
                  >
                    <img src={PlusIcon} alt="plus" />
                    Add School / Graduate Institute
                  </div>
                  <span className={`error-text ${isShowingSchoolAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => {setShowingSchoolAlert(false)}}>Please input your School</span>
                </div>

                <div className="heading col-12 mt-2">Years of Experience</div>
                <FormInput
                  className="col-6 mt-1"
                  type="number"
                  placeholder="Enter number of years"
                  name="years_of_experience"
                  maxLength={2}
                  isRequired
                />
                <div className="heading col-12 mt-3">Jurisdictions</div>
                {values.practice_jurisdictions.map((item, index) => (
                  <div className="d-flex col-12 w-100 mt-0" key={`${index}key`}>
                    <div className="flex-1">
                      <div className="row">
                        <FormCountrySelect
                          className="col-md-3 mt-2"
                          label="Country"
                          name={`practice_jurisdictions[${index}].country`}
                          placeholder="Select a Country"
                          isRequired={userType === "attorney"}
                        />
                        <FormStateSelect
                          className="col-md-3 mt-2"
                          placeholder="Select a state"
                          label="State"
                          name={`practice_jurisdictions[${index}].state`}
                          selectedState={parseInt(values.practice_jurisdictions[index].state?.toString())}
                          country={
                            values.practice_jurisdictions
                              ? values.practice_jurisdictions[
                                  index
                                ].country.toString()
                              : ""
                          }
                          isRequired={userType === "attorney"}
                        />
                        <FormInput
                          className="col-md-3 mt-2"
                          label="Registration Number"
                          name={`practice_jurisdictions[${index}].number`}
                          placeholder="Enter Registration Number"
                          isRequired={userType === "attorney"}
                        />
                        <FormInput
                            className="col-md-3 mt-2"
                            label="Year Admitted"
                            name={`practice_jurisdictions[${index}].year`}
                            placeholder="Select a year"
                            isRequired={userType === "attorney"}
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

                <div className="col-12 mt-2">
                  <div
                    className="add-button"
                    onClick={() => addJurisdiction(values, setFieldValue)}
                  >
                    <img src={PlusIcon} alt="plus" />
                    Add Jurisdictions
                  </div>
                  <span className={`error-text ${isShowingJurisdictionAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => {setShowingJurisdictionAlert(false)}}>Please input your Jurisdiction</span>
                </div>
                <div className="heading col-12 mt-3">Practice Area</div>
                <div className="col-12 mt-2">
                  <FormCheckboxGroup name="specialities" values={specialties} />
                  <div className="row">
                    <div className="col-6 mt-2"></div>
                    <div className="col-6 mt-2">
                      <p className="small_size">If you choose Other, you can create your practice areas after registration in your profile settings</p>
                    </div>
                  </div>
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
  margin: 54px 20px auto 20px;
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;

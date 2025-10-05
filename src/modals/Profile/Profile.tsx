import React, {FC, useState, useRef, MutableRefObject, useEffect} from "react";
import {
  Button,
  FormInput,
  FormSelect,
  FormTextarea, 
  FolderExpandable,
  FullScreenModalFooter,
  FormProfilePhoto,
  FormRadio,
  FormCheckboxGroup2,
  FormMultiSelect,
  FormCurrencyInputWrapper,
  FormCurrencyPrice,
  FormCurrencySelect,
  Input,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
  FormPhoneInputWithValidation,
  FormTaxRate,
  FormFieldPracticeArea
} from "components";
import { validatePhone } from "helpers";
import {
  useBasicDataContext,
  useAuthContext,
  useCommonUIContext,
} from "contexts";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {updateCurrentProfile, createSpecialty, uploadFiles} from "api";
import {isEqual, last} from "lodash";
import styled from "styled-components";
import {useGraduationYears, useInput} from "hooks";
import PlusIcon from "assets/icons/plus_black.svg";
import CloseIcon from "assets/icons/close.svg";
import {SuccessModal} from "../SuccessModal";

const bidData = [
  {
    title: "Yes",
    id: true,
  },
  {
    title: "No",
    id: false,
  },
];

interface IProps {
  handleCancel?: (arg: boolean) => void;
}

export const Profile: FC<IProps> = ({handleCancel}) => {
  const {
    specialties,
    feeTypes,
    currencies,
    appointmentTypes,
    paymentTypes,
    languages,
    refetchSpecialties,
  } = useBasicDataContext();
  const expand = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const graduationYears = useGraduationYears();
  const {userType, profile, setProfile} = useAuthContext();
  const {showErrorModal} = useCommonUIContext();
  const newPracticeArea = useInput("");
  const [successModal, setSuccessModal] = useState(false);
  const [showCreatedPaResult, setShowCreatedPaResult]  = useState(false);

  const [folderOpenStates, setFolderOpenStates] = useState([
    true,
    false,
    false,
    false,
  ]);

  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);

  useEffect(() => {
    refetchSpecialties();
  }, [])

  const setFolderCollapse = (params) => {
    setFolderOpenStates((state) => {
      let temp = [...state];
      temp[params] = !temp[params];
      return temp;
    });
  };

  const setFolderAllCollapse = (index, params) => {
    setFolderOpenStates((state) => {
      let temp = [...state];
      temp = [params, params, params, params];
      temp[index] = true;
      return temp;
    });
  };

  const setNextFolderExpand = async (params) => {
    await setFolderOpenStates((state) => {
      let temp = [...state];
      temp[+params + 1] = true;
      return temp;
    });
    const nextElement: MutableRefObject<Element | null> = expand[params + 1]
    nextElement.current && nextElement.current.scrollIntoView({behavior: "smooth"});
  };

  const addLocation = (values, setFieldValue) => {
    const lastElement: any = last(values.firm_locations);
    console.log("values", values);
    console.log("lastElement", lastElement);
    if (!lastElement) {
      setFieldValue("firm_locations", [
        //...values.firm_locations,
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

  const addJurisdiction = (values, setFieldValue) => {
    const lastElement: any = last(values.practice_jurisdictions);
    if (!lastElement) {
      setFieldValue("practice_jurisdictions", [
        //...values.firm_locations,
        {country: "", state: "", number: "", year: ""},
      ]);
    } 
    else if ( 
      lastElement.country &&
      lastElement.state &&
      lastElement.number &&
      lastElement.year
    ) {
      setFieldValue("practice_jurisdictions", [
        ...values.practice_jurisdictions,
        {country: "", state: "", number: "", year: ""},
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

  const addEducation = (values, setFieldValue) => {
    const lastElement: any = last(values.education);
    if (!lastElement) {
      setFieldValue("education", [
        //...values.firm_locations,
        {university: "", year: ""},
      ]);
    } 
    else if (lastElement.university && lastElement.year) {
      setFieldValue("education", [
        ...values.education,
        {university: "", year: ""},
      ]);
    } 
  };

  const removeEducation = (values, setFieldValue, index) => {
    if (values.education.length > 1) {
      values.education.splice(index, 1);
      setFieldValue("education", [...values.education]);
    }
  };

  const expandInvalidSection = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const newSectionsState = [...folderOpenStates];
    switch (firstErrorKey) {
      case 'firm_locations':
        newSectionsState[1] = true;
        break;
      case 'practice_jurisdictions':
      case 'education':
      case 'years_of_experience':
      case 'specialities': 
        newSectionsState[2] = true;
        break;
      case 'fee_types':
      case 'appointment_type':
      case 'payment_type':
      case 'is_submittable_potential':
        newSectionsState[3] = true;
        break;
      default:
        newSectionsState[0] = true;
    }
    setFolderOpenStates(newSectionsState);
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Valid email is required")
      .required("Email is required"),
    avatar: Yup.string().required("Photo is required"),
    firm_name: Yup.string().nullable(),
    website: Yup.string().matches(
      // eslint-disable-next-line no-useless-escape
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g,
      "The website url format is invalid."
    ).nullable(),
    firm_locations: userType === "paralegal" || userType === "other" ? 
      Yup.object().nullable()
      :
      Yup.array().of(
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
    practice_jurisdictions:
      userType === "mediator"
        ? Yup.array().of(
          Yup.object().shape({
            country: Yup.number()
              .min(1, "Country is required")
              .required("Country is required"),
            state: Yup.number()
              .min(1, "State is required")
              .required("State is required"),
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
    fee_types: Yup.array().min(1, "Fees and Payment are required"),
    appointment_type: userType === "paralegal" || userType === "other" ? 
      Yup.object().nullable()
      :
      Yup.array().min(
      1,
      "Accepted Appointment Type is required"
    ),
    payment_type: Yup.array().min(1, "Accepted Payment Method is required"),
    is_submittable_potential: userType === "paralegal" || userType === "other" ? 
      Yup.object().nullable()
      :
      Yup.bool().oneOf(
      [true, false],
      "This field is required"
    ),
  });

  const handleNewPracticeArea = async () => {
    await createSpecialty(newPracticeArea.value);
    await refetchSpecialties();
    newPracticeArea.onChange("");
    setShowCreatedPaResult(true)
  };

  const deletePracticeField = (event) => {
    event.preventDefault()
  }

  const editPracticeField = (event) => {
    event.preventDefault()
  }

  return (
    <div className="profile-edit-page">
      <Formik
        initialValues={userType === "enterprise" ? profile.admin_user_data : profile}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            let avatarUrl = "";
            if (typeof values.avatar !== "string") {
              const avatars = await uploadFiles(
                [values.avatar],
                "user_avatars",
                0
              );
              avatarUrl = avatars[0];
            } else {
              avatarUrl = values.avatar;
            }

            const res = await updateCurrentProfile({
              ...values,
              tax_rate: values.tax_rate || 0,
              avatar: avatarUrl,
              phone: values.phone.startsWith("+")
                ? values.phone
                : "+" + values.phone,
              userType,
            });
            setProfile(res);
            setSuccessModal(true)
          } catch (error: any) {
            showErrorModal("Error", error);
          }
        }}
      >
        {({values, isValid, isSubmitting= false, errors, setFieldValue}) => {
          return (
            <Form>
              <FolderExpandable
                label="Personal information"
                ref={expand[0]}
                onCollapse={() => setFolderCollapse(0)}
                onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                onNextSection={() => setNextFolderExpand(0)}
                isExpanded={folderOpenStates[0]}
                isCollapseAll={isEqual(folderOpenStates, [
                  true,
                  false,
                  false,
                  false,
                ])}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="heading">Profile Photo</div>
                    <FormProfilePhoto name="avatar"
                                      className="mt-2"
                                      removeButton="Remove"
                                      isRequired={false}
                    />
                  </div>
                  <div className="heading mt-3 col-12">
                    Personal Information
                  </div>
                  <div className="col-md-6 mt-3">
                    <FormInput
                      label="First Name"
                      isRequired
                      name="first_name"
                      placeholder="Input first name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Middle Name"
                      name="middle_name"
                      placeholder="Input middle name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Last Name"
                      isRequired
                      name="last_name"
                      placeholder="Input last name here"
                    />
                    <FormInput
                      className="mt-2"
                      label="Email"
                      name="email"
                      isRequired
                      placeholder="Input email here"
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
                  <div className="col-md-6 mt-3">
                    <FormTextarea
                      label="Biography"
                      placeholder="Describe your legal practice"
                      name="biography"
                      fluidHeight={true}
                    />
                  </div>
                </div>
              </FolderExpandable>
              {
                userType !== 'paralegal' && userType !== 'other' &&
                <FolderExpandable label="Law firm information"
                                  ref={expand[1]}
                                  onCollapse={() => setFolderCollapse(1)}
                                  onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                                  onNextSection={() => setNextFolderExpand(1)}
                                  isExpanded={folderOpenStates[1]}
                                  isCollapseAll={isEqual(folderOpenStates, [
                                    false,
                                    true,
                                    false,
                                    false,
                                  ])}
                                  className="mt-3">
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
                      <span className="heading__desc text-gray ml-4">
                        JustMediationHub will use this address to match you with potential
                        clients in your proximity
                      </span>
                    </div> 
                    {values.firm_locations?.map((item, index) => (
                      <div
                        className="d-flex flex-column w-100 pt-2"
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
                            />
                            <FormStateSelect
                              isRequired
                              className="col-md-4 mt-2"
                              label="State"
                              name={`firm_locations[${index}].state`}
                              placeholder="Select a State"
                              country={values.firm_locations[index].country}
                              selectedState={values.firm_locations[index].state}
                            />
                            <FormCitySelect
                              isRequired
                              className="col-md-4 mt-2"
                              label="City"
                              name={`firm_locations[${index}].city`}
                              placeholder="Enter a city here"
                              state={values.firm_locations[index].state}
                              selectedCity={values.firm_locations[index].city}
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
                          Add an Office address
                        </span>
                      </div>
                    </div>
                  </div>
                </FolderExpandable>
              }
              <FolderExpandable label="Experience & Practice"
                                ref={expand[2]}
                                onCollapse={() => setFolderCollapse(2)}
                                onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                                onNextSection={() => setNextFolderExpand(2)}
                                isExpanded={folderOpenStates[2]}
                                isCollapseAll={isEqual(folderOpenStates, [
                                  false,
                                  false,
                                  true,
                                  false,
                                ])}
                                className="mt-3">
                <div className="row">

                  <div className="heading col-12">Education</div>
                  {values.education?.map((item, index) => (
                    <div
                      className="d-flex w-100 col-12 mt-0"
                      key={`${index}key`}
                    > 
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
                        <CloseButton
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
                      className="add-button cursor-pointer d-flex"
                      onClick={() => addEducation(values, setFieldValue)}
                    >
                      <img src={PlusIcon} alt="plus"/>
                      <span className="my-auto ml-1">Add School / Graduate Institute</span>
                    </div>
                  </div>

                  <div className="heading col-12 mt-2">Years of Experience</div>
                  <FormInput
                    className="col-6 mt-1"
                    type="number"
                    placeholder="Enter number of years"
                    name="years_of_experience"
                    isRequired
                  />
                  <div className="heading col-12 mt-3">Jurisdictions</div>
                  {values?.practice_jurisdictions?.map((item, index) => (
                    <div
                      className="d-flex col-12 w-100 mt-0"
                      key={`${index}key`}
                    >
                      <div className="flex-1">
                        <div className="row">
                          <FormCountrySelect
                            className="col-md-3 mt-2"
                            label="Country"
                            name={`practice_jurisdictions[${index}].country`}
                            placeholder="Select a Country"
                            isRequired={userType === "mediator"}
                          />
                          <FormStateSelect
                            className="col-md-3 mt-2"
                            placeholder="Select a state"
                            label="State"
                            name={`practice_jurisdictions[${index}].state`}
                            isRequired={userType === "mediator"}
                            country={values.practice_jurisdictions[index].country}
                            selectedState={values.practice_jurisdictions[index].state}
                          />
                          <FormInput
                            className="col-md-3 mt-2"
                            label="Registration Number"
                            name={`practice_jurisdictions[${index}].number`}
                            placeholder="Enter Registration Number"
                            isRequired={userType === "mediator"}
                          />
                          <FormInput
                            className="col-md-3 mt-2"
                            label="Year Admitted"
                            name={`practice_jurisdictions[${index}].year`}
                            placeholder="Select a year"
                            isRequired={userType === "mediator"}
                          />
                        </div>
                      </div>
                      {values.practice_jurisdictions.length > 1 && (
                        <CloseButton
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
                      className="add-button cursor-pointer d-flex"
                      onClick={() => addJurisdiction(values, setFieldValue)}
                    >
                      <img src={PlusIcon} alt="plus"/>
                      <span className="my-auto ml-1">Add Jurisdictions</span>
                    </div>
                  </div>
                  <div className="heading col-12 mt-3">Practice Area</div>
                  <div className="col-12 mt-2">

                    <FormFieldPracticeArea
                      name="specialities"  
                      values={specialties} 
                      deletePracticeField={deletePracticeField}
                      editPracticeField={editPracticeField}
                      refetchSpecialties={refetchSpecialties}
                    /> 
                    {/*<FormCheckboxGroup*/}
                    {/*  name="specialities"*/}
                    {/*  values={specialties}*/}
                    {/*/>*/}
                  </div>
                  <div className="col-12 row mt-2">
                    <div className="col-6">
                      <div className="d-flex w-100">
                        <Input
                          className="flex-1"
                          placeholder="Create Practice Area"
                          {...newPracticeArea}
                        />
                        <CreatePA onClick={handleNewPracticeArea}>
                          Create
                        </CreatePA>
                      </div>
                    </div>
                  </div>
                </div>
              </FolderExpandable>
              <FolderExpandable
                label="Service & Pricing"
                ref={expand[3]}
                className="mt-3"
                isShowNext={false}
                onCollapse={() => setFolderCollapse(3)}
                onCollapseAll={(param) => setFolderAllCollapse(null, param)}
                onNextSection={() => setNextFolderExpand(3)}
                isExpanded={folderOpenStates[3]}
                isCollapseAll={isEqual(folderOpenStates, [
                  false,
                  false,
                  false,
                  true,
                ])}
              >
                <div className="row">
                  {
                    userType !== 'paralegal' && userType !== 'other' &&
                    <>
                      <div className="heading col-12">
                        Accepted Appointment Type
                        <span className="text-gray ml-2">
                          Select all that apply
                        </span>
                      </div>
                      <div className="mt-1 d-flex flex-wrap col-12">
                        <FormCheckboxGroup2
                          name="appointment_type"
                          values={appointmentTypes}
                        />
                      </div>
                    </>
                  }
                  <div className="heading mt-3 col-12 ">Fees and Payment *</div>
                  <div className="text-black mt-2 col-12 ">
                    Fee Type
                    <span className="text-gray ml-2">
                      Select all that apply
                    </span>
                  </div>
                  <div className="mt-0 d-flex flex-wrap col-12">
                    <FormCheckboxGroup2 name="fee_types" values={feeTypes}/>
                  </div>
                  <div className="text-black mt-2 col-12 ">
                    Accepted Payment Methods
                    <span className="text-gray ml-2">
                      Select all that apply
                    </span>
                  </div>
                  <div className="mt-0 d-flex flex-wrap col-12">
                    <FormCheckboxGroup2
                      name="payment_type"
                      values={paymentTypes}
                    />
                  </div>

                  <div className="text-black mt-3 w-100">
                    <div className="col-6 d-flex">
                      <span>Hourly Rate</span>
                      <div className="text-gray ml-auto mt-auto">Optional</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <FormCurrencyInputWrapper>
                      <FormCurrencyPrice
                        name="fee_rate"
                        placeholder="Enter your hourly rate"
                      />
                      <FormCurrencySelect
                        name="fee_currency"
                        values={currencies}
                      />
                    </FormCurrencyInputWrapper>
                  </div>
                  <div className="heading mt-3 w-100">
                    <div className="col-6 d-flex">
                      <span className="mb-1">Languages spoken</span>
                      <div className="text-gray ml-auto mt-auto">Optional</div>
                    </div>
                  </div>
                  <FormMultiSelect
                    className="mt-0 col-6"
                    values={languages}
                    name="spoken_language"
                    placeholder="Select langauges"
                    isRequired
                  />
                  {
                    userType !== 'paralegal' && userType !== 'other' &&
                    <>
                      <div className="heading mt-3 col-12">
                        Do you want to submit proposals for potential client
                        engagements?
                      </div>
                      <div className="col-12">
                        <FormRadio
                          values={bidData}
                          name="is_submittable_potential"
                        />
                      </div>
                    </>
                  }
                  <div className="heading mt-3 w-100">
                    <div className="col-6 d-flex">
                      <span className="mb-1">Tax Rate</span>
                      <div className="text-gray ml-auto mt-auto">Optional</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <FormTaxRate
                      name="tax_rate"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-12 mt-3">
                    *The amount shown under Fee Type is equivalent to the “composite rate.” Composite Rate = Mediator Legal Fees + Separate and Standalone 5% JustMediationHub Management Fee. This formula applies to hourly, flat, hourly, contingency, and other rates on our platform.
                  </div>
                </div>
              </FolderExpandable>
              <FullScreenModalFooter>
                <Button
                  buttonType="submit"
                  className="ml-auto"
                  size="large"
                  theme="white"
                  onClick={() => handleCancel && handleCancel(false)}
                >
                  Cancel
                </Button>
                <Button
                  buttonType="submit"
                  size="large"
                  className="ml-3"
                  theme="yellow"
                  isLoading={isSubmitting}
                  onClick={() => {
                    !isValid && expandInvalidSection(errors);
                  }}
                >
                  Save
                </Button>
              </FullScreenModalFooter>
            </Form>
          );
        }}
      </Formik>

      <SuccessModal
        title="Added Successfully"
        open={showCreatedPaResult}
        setOpen={() => {}}
        callback={() => setShowCreatedPaResult(false)}
      />

      <SuccessModal title="Changes Saved"
                    open={successModal}
                    setOpen={setSuccessModal}
                    callback={() => setSuccessModal(false)}
      />
    </div>
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

const CreatePA = styled.div`
  color: #98989a;
  font-size: 14px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 300ms ease;
  margin-left: 20px;

  &:hover {
    opacity: 0.7;
  }
`;

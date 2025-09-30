import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  FormInput,
  FormProfilePhoto,
  Button,
  SignupBar,
  Folder,
  FolderItem,
  FormSelect,
  FormCountrySelect,
  FormStateSelect,
  FormCitySelect,
  FormEmailSelect,
} from "components";
import styled from "styled-components";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import { EnterpriseOnboardingDto } from "types";
import PlusIcon from "assets/icons/plus_black.svg";
import CloseIcon from "assets/icons/close.svg";
import * as Yup from "yup";
import "./../style.scss";

const validationSchema = Yup.object().shape({
  firm_name: Yup.string().required("Firm Name is required"),
  team_logo: Yup.string().required("Logo is required"),
  firm_locations: Yup.array().of(
    Yup.object().shape({
      country: Yup.number().min(1).required("Country is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.number().min(1).required("State is required"),
      zip_code: Yup.string().required("Zip code is required"),
    })
  ),
  team_members: Yup.array().of(
    Yup.object().shape({
      email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required"),
      type: Yup.string().required("Type is required"),
    })
  ),
});

const userTypes = [
  {
    id: "attorney",
    title: "Attorney",
  },
  {
    id: "paralegal",
    title: "Paralegal",
  },
];

interface Props {
  onNext(params: EnterpriseOnboardingDto): void;
  initData: EnterpriseOnboardingDto;
}

export const TeamSettings = ({ onNext, initData }: Props) => {
  const [registeredTeamMembers, setRegisteredTeamMembers] = useState<{ id: number, email: string }[]>([]);

  const addLocation = (values, setFieldValue) => {
    setFieldValue("firm_locations", [
      ...values.firm_locations,
      { country: "", state: "", city: "", zip_code: "", address: "" },
    ]);
  };
  const removeLocation = (values, setFieldValue, index) => {
    if (values.firm_locations.length) {
      values.firm_locations.splice(index, 1);
      setFieldValue("firm_locations", [...values.firm_locations]);
    }
  };

  const addTeamMember = (values, setFieldValue) => {
    setFieldValue("team_members", [
      ...values.team_members,
      { uid: nanoid(), email: "", type: "" },
    ]);
  };
  const removeTeamMember = (values, setFieldValue, index, email) => {
    if (values.team_members?.length) {
      values.team_members.splice(index, 1);
      setFieldValue("team_members", [...values.team_members]);
      setRegisteredTeamMembers(registeredTeamMembers.filter((user) => user.email !== email))
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
        const teamMemberRegistered = registeredTeamMembers.map((user) => { return user.id });        
        onNext({
          ...values,
          team_members_registered: teamMemberRegistered,
          team_members: values.team_members.filter(
            (member) => !registeredTeamMembers.some(user => user.email.includes(member.email)) 
          ),
        });
      }}
    >
      {({ errors, values, initialValues, setFieldValue }) => {
        const hasChanged = isEqual(values, initialValues);
        const hasErrors = Object.keys(errors).length > 0;
        return (
          <Form>
            <Folder label="Law Firm Information" className="mt-3">
              <FolderItem className="p-4">
                <div className="row">
                  <FormInput
                    label="Firm Name"
                    name="firm_name"
                    placeholder="Enter a name"
                    isRequired
                    className="col-6"
                  />
                  <div className="col-12 mt-3">
                    <FormProfilePhoto
                      name="team_logo"
                      label="Logo"
                      maxFileSize={2 * 1024 * 1024}
                      buttonLabel="Upload an Image"
                      isRequired={false}
                    />
                  </div>
                  <div className="heading col-12 mt-3 mb-2">Office Address</div>
                  {values.firm_locations?.map((item, index) => (
                    <div
                      className="d-flex flex-column w-100 pt-2"
                      key={`${index}key`}
                    >
                      <div className="d-flex pr-3">
                        {values.firm_locations &&
                          values.firm_locations.length > 1 && (
                            <IconButton
                              className="ml-auto mt-4"
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
                            className="col-md-6"
                            label="Country"
                            name={`firm_locations[${index}].country`}
                            placeholder="Select a Country"
                          />
                          <FormInput
                            className="col-md-6"
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
                            country={
                              values.firm_locations
                                ? values.firm_locations[
                                    index
                                  ].country.toString()
                                : ""
                            }
                            selectedState={values.firm_locations[index].state}
                            placeholder="Select a State"
                          />
                          <FormCitySelect
                            isRequired
                            className="col-md-4 mt-2"
                            label="City"
                            name={`firm_locations[${index}].city`}
                            placeholder="Enter a city here"
                            state={
                              values.firm_locations
                                ? values.firm_locations[index].state.toString()
                                : ""
                            }
                            selectedCity={!isNaN(+values.firm_locations[index].city) ? parseInt(values.firm_locations[index].city) : undefined}
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
                  </div>
                </div>
              </FolderItem>
            </Folder>
            <div className="text-gray float-right mt-4">
              {20 - values.team_members.length}/20 seats available
            </div>
            <Folder className="mt-4" label="Team Members">
              <FolderItem className="p-4">
                <div className="row">
                  {values.team_members?.map((item, index) => (
                    <div className="flex-column w-100" key={item.uid}>
                      <div className="col-12 mb-2">
                        <div className="justify-content-end">
                          <IconButton
                            src={CloseIcon}
                            onClick={() =>
                              removeTeamMember(values, setFieldValue, index, item.email)
                            }
                          />
                        </div>
                        <div className="row">
                          <FormEmailSelect
                            className="col-md-6"
                            label="Email"
                            name={`team_members[${index}].email`}
                            placeholder="Enter an email here"
                            registeredTeamMembers={registeredTeamMembers}
                            setRegisteredTeamMembers={setRegisteredTeamMembers}
                            teamMembers={values.team_members}
                            isRequired
                          />
                          <FormSelect
                            values={userTypes}
                            isRequired
                            className="col-md-6"
                            label="User Type"
                            name={`team_members[${index}].type`}
                            placeholder="Select a User type"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-12 mt-2">
                    <div
                      className="add-button"
                      onClick={() => addTeamMember(values, setFieldValue)}
                    >
                      <img src={PlusIcon} alt="plus" />
                      Add an Team Member
                    </div>
                  </div>
                </div>
              </FolderItem>
            </Folder>
            <SignupBar>
              <div>
                You can change your team settings at anytime under{" "}
                <b>Settings</b>
              </div>
              <Button
                className="ml-auto"
                buttonType="submit"
                disabled={hasErrors}
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
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;

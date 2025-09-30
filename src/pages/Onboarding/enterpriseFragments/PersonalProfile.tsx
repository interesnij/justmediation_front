import React, {useEffect, useState} from "react";
import {
  FormInput,
  FormProfilePhoto,
  Button,
  SignupBar,
  FormPhoneInputWithValidation,
  Folder,
  FolderItem,
  LinkButton,
} from "components";
import { validatePhone } from "helpers";
import { isEqual } from "lodash";
import { Formik, Form } from "formik";
import { EnterpriseOnboardingDto } from "types";
import { onboardEnterprise, uploadFiles } from "api";
import { useAuthContext, useCommonUIContext } from "contexts";
import { useModal } from "hooks";
import * as Yup from "yup";
import { ApplicationReceiveModal } from "modals";
import "./../style.scss";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  middle_name: Yup.string(),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  avatar: Yup.string().required("Photo is required"),
});

interface Props {
  onBack(): void;
  initData: EnterpriseOnboardingDto;
}

export const PersonalProfile = ({ onBack, initData }: Props) => {
  const { userId } = useAuthContext();
  const { showErrorModal } = useCommonUIContext();
  const verifyModal = useModal();
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <Formik
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const avatars = await uploadFiles([values.avatar], "user_avatars", 0);
          const team_logo = await uploadFiles(
            [values.team_logo],
            "user_avatars",
            0
          );

          await onboardEnterprise(userId, {
            ...values,
            avatar: avatars[0],
            team_logo: team_logo[0],
          });
          verifyModal.setOpen(true);
        } catch (error: any) {
          showErrorModal("Error", error);
        }
      }}
    >
      {({ errors, values, initialValues, setFieldValue, isSubmitting }) => {
        const hasChanged = initialValues.first_name
          ? false
          : isEqual(values, initialValues);
        const hasErrors = Object.keys(errors).length > 0;
        return (
          <Form>
            <Folder label="Profile Photo" className="mt-3">
              <FolderItem>
                <div className="row">
                  <div className="col-12">
                    <FormProfilePhoto name="avatar" label="" isRequired={false}/>
                  </div>
                </div>
              </FolderItem>
            </Folder>
            <Folder className="mt-4" label="Personal Information">
              <FolderItem className="p-4">
                <div className="row">
                  <FormInput
                    className="col-md-4"
                    label="First Name"
                    name={"first_name"}
                    placeholder="Enter first name"
                    isRequired
                  />
                  <FormInput
                    className="col-md-4"
                    name={"middle_name"}
                    label="Middle Name"
                    placeholder="Enter middle name"
                  />
                  <FormInput
                    isRequired
                    className="col-md-4"
                    name={"last_name"}
                    label="Last Name"
                    placeholder="Enter last name"
                  />
                  <FormInput
                    isRequired
                    className="col-md-4 mt-2"
                    name={"role"}
                    label="Specify Your Role"
                    placeholder="Enter your role"
                  />
                  <FormInput
                    isRequired
                    className="col-md-4 mt-2"
                    name={"email"}
                    label="Email"
                    placeholder="Enter your email"
                  />
                  <FormPhoneInputWithValidation
                    className="col-md-4 mt-2"
                    label="Phone"
                    name="phone"
                    validate={value => validatePhone(value, countryPhoneObject)}
                    getCountryPhoneObject={setCountryPhoneObject}
                    isRequired
                  />
                </div>
              </FolderItem>
            </Folder>
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
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </SignupBar>
            {
              verifyModal?.open &&
              <ApplicationReceiveModal {...verifyModal} />
            }
          </Form>
        );
      }}
    </Formik>
  );
};

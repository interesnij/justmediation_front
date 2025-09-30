import React, {useEffect, useState} from "react";
import {
  FormInput,
  Button,
  SignupBar,
  LinkButton,
  Folder,
  FolderItem,
  FormProfilePhoto,
  FormPhoneInputWithValidation,
} from "components";
import { validatePhone } from "helpers";
import { registerParalegal, uploadFiles } from "api";
import { isEqual, unset } from "lodash";
import { useModal } from "hooks";
import { ParalegalRegisterDto } from "types";
import { Formik, Form } from "formik";
import { SignupLayout } from "layouts";
import { ApplicationReceiveModal } from "modals";
import { useCommonUIContext } from "contexts";
import * as Yup from "yup";
import "./../style.scss";
import {useLocation} from "@reach/router";
interface Props {
  onBack(): void;
  initData: ParalegalRegisterDto;
}

const OtherFormValidationSchema = Yup.object().shape({
  avatar: Yup.string().required("Profile Photo is required"),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  role: Yup.string().required("Role is required"),
});

export const OtherForm = ({ onBack, initData }: Props) => {
  const search = new URLSearchParams(useLocation().search);
  const invite_uuid = search.get("invite");
  const verifyModal = useModal();
  const { showErrorModal } = useCommonUIContext();
  const [countryPhoneObject, setCountryPhoneObject] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <SignupLayout>
      <Formik
        initialValues={initData}
        validationSchema={OtherFormValidationSchema}
        onSubmit={async (values) => {
          unset(values, "practice_jurisdictions");
          const avatars = await uploadFiles(
            [values.avatar], 
            "user_avatars",
            0
          );
          const formData = {
            ...values,
            avatar: avatars[0],
          }
          try {
            const res = await registerParalegal(formData, invite_uuid);
            console.log("res", res);
            verifyModal.setOpen(true);
          } catch (error: any) {
            showErrorModal("Error", error);
          }
        }}
      >
        {({ errors, values, initialValues, isSubmitting }) => {
          const hasChanged = initialValues.email
            ? false
            : isEqual(values, initialValues);
          const hasErrors = Object.keys(errors).length > 0;
          return (
            <Form>
              <div className="label">Step 3 of 3</div>
              <div className="title pb-4">Set Up Your Profile</div>
              <div className="desc mx-auto">
                You can update the <b>profile information</b> later in{" "}
                <b>“My Account &gt; Edit Profile”</b>
              </div>

              <Folder className="mt-4" label="Personal Photo">
                <FolderItem>
                  <FormProfilePhoto name="avatar" label="" isRequired={false}/>
                </FolderItem>
              </Folder>

              <Folder className="mt-4" label="Personal Information">
                <FolderItem>
                  <div className="row">
                    <FormInput
                      className="col-md-6 mt-1"
                      label="First Name"
                      placeholder="Enter your first name"
                      isRequired
                      name="first_name"
                    />
                    <FormInput
                      className="col-md-6 mt-1"
                      label="Last Name"
                      name="last_name"
                      placeholder="Enter your last name"
                      isRequired
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
                      className="col-6 mt-3 mb-3"
                      label="Specify your role"
                      name="role"
                      placeholder="E.g. Accounting, Hr, etc"
                      isRequired
                    />
                  </div>
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
                  disabled={hasChanged || hasErrors}
                  isLoading={isSubmitting}
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
        <ApplicationReceiveModal {...verifyModal} />
      }
    </SignupLayout>
  );
};

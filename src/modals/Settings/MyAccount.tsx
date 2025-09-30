import React from "react";
import { Button, FormInput, Folder, FolderItem, Switch } from "components";
import { ChangePasswordModal, WelcomeModal } from "modals";
import { Formik, Form } from "formik";
import { useModal } from "hooks";
import * as Yup from "yup";
import { update2FA, updateCurrentProfile } from "api";
import { useAuthContext } from "contexts";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Valid email is required")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});
export const MyAccount = () => {
  const passwordModal = useModal();
  const welcomeModal = useModal();
  const {
    profile,
    tfa: mfa,
    userId,
    setProfile,
    update2FA: handleUpdate2FA,
    userType,
  } = useAuthContext();

  const handlePasswordUpdate = () => {
    passwordModal.setOpen(true);
  };

  const handle2FA = async (params) => {
    if (params) {
      welcomeModal.setOpen(true);
    } else {
      await update2FA(userId, params);
      handleUpdate2FA(params);
    }
  };

  return (
    <div className="settings settings-modal">
      <Formik
        initialValues={userType === "enterprise" ? profile.admin_user_data : profile}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          values.userType = userType;
          const res = await updateCurrentProfile(values);
          setProfile(res);
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Folder label="Account Information" className="jumbo">
                <FolderItem>
                  <div className="row">
                    <FormInput
                      label="First Name"
                      className="mt-2 col-md-4"
                      isRequired
                      disabled
                      name="first_name"
                      placeholder="Input first name here"
                    />
                    <FormInput
                      className="mt-2 col-md-4"
                      label="Middle Name"
                      name="middle_name"
                      isRequired
                      disabled
                      placeholder="Input middle name here"
                    />
                    <FormInput
                      className="mt-2 col-md-4"
                      label="Last Name"
                      name="last_name"
                      isRequired
                      disabled
                      placeholder="Input last name here"
                    />
                    <FormInput
                      className="mt-2 col-md-6"
                      label="Email"
                      name="email"
                      isRequired
                      disabled
                      placeholder="Input email here"
                    />
                    <FormInput
                      className="mt-2 col-md-6"
                      label="Phone"
                      name="phone"
                      isRequired
                      disabled
                      placeholder="Input phone here"
                    />
                  </div>
                </FolderItem>
              </Folder>
            </Form>
          );
        }}
      </Formik>
      <Folder label="Password & Security" className="jumbo mt-3">
        <FolderItem>
          <div className="d-flex justify-content-between">
            <div>
              <div className="heading">Password</div>
              <div className="desc">Update your password here</div>
            </div>
            <div
              className="my-auto text-black font-size-md cursor-pointer"
              onClick={handlePasswordUpdate}
            >
              Update
            </div>
          </div>
        </FolderItem>
        <FolderItem>
          <div className="row">
            <div className="col-md-6">
              <div className="heading">2-Factor Authentication</div>
              <div className="desc">
                Add an extra layer of security to your account by enabling this
                2-step authentication. We'll send you a test message (SMS) of a
                one-time security code to use along with your password.
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <Switch
                className="my-auto ml-auto"
                value={mfa}
                onChange={(e) => handle2FA(e)}
              />
            </div>
          </div>
        </FolderItem>
      </Folder>
      {
        passwordModal?.open &&
        <ChangePasswordModal {...passwordModal} />
      }
      {
        welcomeModal?.open &&
        <WelcomeModal
          {...welcomeModal}
          welcome={false}
        />
      }
    </div>
  );
};

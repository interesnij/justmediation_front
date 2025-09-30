import React from "react";
import { Modal, Button, FormInput } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { changePassword } from "api";
import { useCommonUIContext } from "contexts";
import "./style.scss";

const validationSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Old Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&._-]{8,}$/,
      "Must contain at least one special character and number"
    ),
  new_password1: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&._-]{8,}$/,
      "Must contain at least one special character and number"
    ),
  new_password2: Yup.string()
    .oneOf([Yup.ref("new_password1"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
}
export const ChangePasswordModal = ({ open, setOpen }: Props) => {
  let reset = () => {};
  const { showErrorModal } = useCommonUIContext();
  return (
    <Modal
      title="Change your password"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="add-expense-entry-modal">
        <Formik
          initialValues={{
            old_password: "",
            new_password1: "",
            new_password2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await changePassword(values);
              reset();
              setOpen(false);
            } catch (error: any) {
              showErrorModal("Error", error);
            }
          }}
        >
          {({ resetForm, isSubmitting }) => {
            reset = resetForm;
            return (
              <Form>
                <div className="row">
                  <FormInput
                    name="old_password"
                    placeholder="Current password"
                    isRequired
                    className="col-12"
                    type="password"
                    label="Confirm your current password"
                  />
                  <FormInput
                    name="new_password1"
                    placeholder="New password"
                    isRequired
                    className="col-12 mt-3"
                    type="password"
                    label="Enter your new password"
                  />
                  <FormInput
                    name="new_password2"
                    placeholder="Confirm new password"
                    isRequired
                    className="col-12 mt-3"
                    type="password"
                    label="Confirm your new password"
                  />
                </div>
                <div className="d-flex mt-2">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    buttonType="submit"
                    isLoading={isSubmitting}
                    size="large"
                  >
                    Change Password
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

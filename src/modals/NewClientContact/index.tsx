import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Button, FormInput } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
}
const titles = ["Add New Contact", "New Client Contact"];
export const NewClientContactModal = ({ open, setOpen }: Props) => {
  let reset = () => {};

  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    userType && setStep((step) => step + 1);
    return () => {};
  }, [userType]);

  useEffect(() => {
    if (open) {
      setUserType("");
      setStep(0);
    }
    return () => {};
  }, [open]);

  return (
    <Modal
      title={titles[step]}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        {step === 0 ? (
          <>
            <div className="mb-4">Who would you like to add?</div>
            <div className="row">
              <div className="col-md-6">
                <UserType
                  className="d-flex"
                  onClick={() => setUserType("client")}
                >
                  <div className="m-auto">Client User</div>
                </UserType>
              </div>
              <div className="col-md-6">
                <UserType
                  className="d-flex"
                  onClick={() => setUserType("other")}
                >
                  <div className="m-auto">Mediator others</div>
                </UserType>
              </div>
            </div>
          </>
        ) : step === 1 ? (
          <Formik
            initialValues={{
              email: "",
              phone: "",
              first_name: "",
              last_name: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              // await createForumPost(values);
              setOpen(false);
              reset();
            }}
          >
            {({ resetForm, isSubmitting }) => {
              reset = resetForm;
              return (
                <Form>
                  <div className="row">
                    <FormInput
                      className="col-md-6"
                      name="email"
                      label="Email"
                      placeholder="Enter an email address"
                      isRequired
                    />
                    <FormInput
                      className="col-md-6"
                      name="phone"
                      label="Phone"
                      placeholder="Enter a phone number"
                    />
                    <FormInput
                      className="col-md-6 mt-3"
                      name="first_name"
                      label="First Name"
                      placeholder="Enter first name"
                    />
                    <FormInput
                      className="col-md-6 mt-3"
                      name="last_name"
                      label="Last Name"
                      placeholder="Enter last name"
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
                      Add to clients and send invitation
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
};

const UserType = styled.div`
  height: 160px;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 12px;
  color: #2e2e2e;
  text-align: center;
  transition: all 300ms ease;
  font-size: 16px;
  letter-spacing: -0.01em;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.8);
    color: rgba(0, 0, 0, 0.8);
  }
`;

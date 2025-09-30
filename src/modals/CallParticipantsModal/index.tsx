import React from "react";
import { Modal, Button, FormCheckboxGroup3 } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params: any): void;
  allParticipants: {
    first_name: string;
    last_name: string;
    avatar: string;
    id: number;
  }[];
}

const validationSchema = Yup.object().shape({
  participants: Yup.array()
    .min(1, "Participants are required")
    .required("Participants are required"),
});
export const CallParticipantsModal = ({ open, setOpen, onCreate = (any) => {}, allParticipants }: Props) => {
  let reset = () => {};
      
  return (
    <Modal
      title="Start a Call"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div style={{ width: 700 }}>
        <Title>Select participants to join this call</Title>
        <Formik
          initialValues={{
            participants: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onCreate(values?.participants);
            setOpen(false);
          }}
        >
          {({ errors, isSubmitting, resetForm }) => {
            reset = resetForm;
            const hasErrors = Object.keys(errors).length > 0;
            return (
              <Form>
                <FormCheckboxGroup3 name="participants" values={allParticipants} />
                <div className="d-flex mt-2">
                  <Button
                    buttonType="button"
                    className="ml-auto"
                    theme="white"
                    size="large"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-3"
                    isLoading={isSubmitting}
                    disabled={hasErrors}
                    buttonType="submit"
                    size="large"
                  >
                    Start Call
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

const Title = styled.div`
    font-family: DM Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 23px;
    margin: 0 0 30px 0;
`;

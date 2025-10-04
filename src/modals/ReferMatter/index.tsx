import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Modal,
  Button,
  IndustryContactSearch,
  User,
  FormTextarea,
} from "components";
import { useInput } from "hooks";
import { sendMatterReferral } from "api";
import { getUserName } from "helpers";
import { Formik, Form } from "formik";
import { useCommonUIContext } from "contexts";
import * as Yup from "yup";
import InfoImg from "assets/icons/info_green.svg";
import "./style.scss";

const validationSchema = Yup.object().shape({
  message: Yup.string().required("Message is required"),
});

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onAdd?(): void;
  matterData?: any;
}
export const ReferMatterModal = ({
  open,
  setOpen,
  matterData,
  onAdd = () => {},
}: Props) => {
  let reset = () => {};
  const userEmail = useInput("");
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<any>();
  const { showErrorModal } = useCommonUIContext();

  useEffect(() => {
    if (open) {
      userEmail.onChange("");
      setContact({});
      reset();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {};
  }, [userEmail.value]);

  const handleAddContact = async () => {
    setStep(1);
  };

  return (
    <Modal
      title={step === 0 ? "Refer to" : `Refer to ${getUserName(contact)}`}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      {step === 0 ? (
        <div className="new-post-modal">
          <IndustryContactSearch
            {...userEmail}
            id={contact?.id}
            onSelect={setContact}
          />
          <div className="d-flex mt-2">
            <Button
              buttonType="button"
              className="ml-auto"
              theme="white"
              size="large"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              className="ml-3"
              disabled={!contact?.id}
              size="large"
              onClick={handleAddContact}
            >
              Add
            </Button>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="new-post-modal">
          <div className="d-flex">
            <img src={InfoImg} alt="info" className="mb-auto mt-1" />
            <div className="ml-1 flex-1">
              <div className="text-green">ATTENTION:</div>
              <div className="text-dark">
                If your request is accepted, you will no longer have access to
                this matter and its details unless the principle mediator shares
                it with you. You can view this referral in your <b>Matters</b>{" "}
                by selecting <b>Status: Referred</b> .
              </div>
            </div>
          </div>
          <MatterContainer>
            <div className="text-dark font-size-lg">{matterData?.title}</div>
            <div className="text-dark">
              {`Description: ${matterData?.description}`}
            </div>
            <div className="d-flex mt-2">
              <div>
                <div className="text-gray">PRACTICE AREA</div>
                <div className="text-black">
                  {matterData?.speciality_data?.title}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-gray">JURISDICTION</div>
                <div className="text-black">
                  {`${matterData?.city_data?.name} ${matterData?.state_data?.name} ${matterData?.country_data?.name}`}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-gray">CLIENT</div>
              <div className="d-flex">
                <User
                  avatar={matterData?.client_data?.avatar}
                  userName={getUserName(matterData?.client_data)}
                />
              </div>
            </div>
          </MatterContainer>

          <Formik
            initialValues={{
              mediator: contact?.id,
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                await sendMatterReferral(matterData?.id, values);
                onAdd();
                setOpen(false);
                reset();
              } catch (error: any) {
                showErrorModal("Error", error);
              }
            }}
          >
            {({ resetForm, isSubmitting, errors }) => {
              const hasErrors = Object.keys(errors).length > 0;
              reset = resetForm;

              return (
                <Form>
                  <div className="row">
                    <FormTextarea
                      name="message"
                      label="Message"
                      placeholder="Type your message here"
                      className="col-12 mt-2"
                      fluidHeight
                    />
                  </div>
                  <div className="d-flex mt-2">
                    <Button
                      buttonType="button"
                      className="ml-auto"
                      theme="white"
                      size="large"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="ml-3"
                      size="large"
                      buttonType="submit"
                      disabled={hasErrors}
                      isLoading={isSubmitting}
                    >
                      Send Referral
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : null}
    </Modal>
  );
};

const MatterContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 4px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 24px 0px;
  padding: 24px 16px;
`;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Button, Input, PhoneInput } from "components";
import { useAuthContext } from "contexts";
import { isValidItlPhoneNumber } from "helpers";
import { useInput } from "hooks";
import {
  send2FA,
  confirm2FA,
  update2FA,
  updateCurrentProfile,
} from "api";
import "./style.scss";
interface Props {
  open: boolean;
  welcome?: boolean;
  setOpen(param: boolean): void;
  onUpdate?(params: string): void;
}
const titles = [
  "Welcome to JustMediationHub!",
  "2-Factor Authentication",
  "Type your code",
];
export const WelcomeModal = ({ open, welcome = true, setOpen, onUpdate = () => {} }: Props) => {
  const [step, setStep] = useState(0);
  const [authType, setAuthType] = useState("");
  const { phone } = useAuthContext();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = useInput("");
  const code = useInput("");
  const [newPhone, setNewPhone] = useState("");
  let reset = () => {};
  const {
    update2FA: handleUpdate2FA,
    setPhone,
    userId,
    userType,
  } = useAuthContext();

  useEffect(() => {
    if (open) {
      localStorage.setItem("tfa", "shown");
      phoneNumber.onChange("");
      code.onChange("");
      welcome? setStep(0) : setStep(1);
      setNewPhone("");
      setError("");
    }
    return () => {};
  }, [open]);

  const handleNext = () => {
    setStep(1);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      setNewPhone(
        authType === "new" || authType === "" ? "+" + phoneNumber.value : phone
      );
      await send2FA(
        authType === "new" || authType === "" ? "+" + phoneNumber.value : phone
      );
      setIsLoading(false);
      setStep(2);
    } catch (error: any) {
      setError(error?.response?.data?.detail);
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    try {
      setError("");
      setIsLoading(true);
      await confirm2FA({
        phone: newPhone,
        code: code.value,
      });
      await updateCurrentProfile({ phone: newPhone, userType });
      await update2FA(userId, true);
      setPhone(newPhone, true);
      setIsLoading(false);
      setOpen(false);
    } catch (error: any) {
      setError(error?.response?.data?.detail);
      setIsLoading(false);
    }
  };

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
          <div>
            <Heading>Security Setup</Heading>
            <SecuritySetupContainer>
              <div className="title">2-Factor Authentication</div>
              <div>
                Add an extra layer of security to your account by enabling this
                2-step authentication. We’ll send you a text message (SMS) of a
                one-time security code to use along with your password the next
                time you login.
              </div>
            </SecuritySetupContainer>
            <div className="d-flex mt-3">
              <Button
                buttonType="button"
                className="ml-auto"
                size="large"
                type="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Go to Dashboard
              </Button>
              <Button className="ml-3" size="large" onClick={handleNext}>
                Set Up Authentication
              </Button>
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <Heading>Confirm your phone number</Heading>
            {phone ? (
              <div>
                <div className="d-flex mt-3">
                  <div
                    className={
                      authType === "receive"
                        ? "welcome_auth__check-active"
                        : "welcome_auth__check"
                    }
                    onClick={() => setAuthType("receive")}
                  />
                  <div>
                    <div className="text-dark">Receive a text at</div>
                    <div className="text-black">Mobile {phone}</div>
                  </div>
                </div>
                <div className="d-flex mt-2">
                  <div
                    className={
                      authType === "new"
                        ? "welcome_auth__check-active"
                        : "welcome_auth__check"
                    }
                    onClick={() => setAuthType("new")}
                  />
                  <div className="row flex-1">
                    <div className="col-6">
                      <div className="text-dark">Enter a new phone number</div>
                      <PhoneInput placeholder="Enter number" {...phoneNumber} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row flex-1">
                <div className="col-6">
                  <div className="text-dark">Enter a new phone number</div>
                  <PhoneInput placeholder="Enter number" {...phoneNumber} />
                </div>
              </div>
            )}
            {error && <Error>{error}</Error>}
            <div className="d-flex mt-3">
              <Button
                buttonType="button"
                className="ml-auto"
                size="large"
                type="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="ml-3"
                size="large"
                disabled={
                  !(
                    (authType === "new" &&
                      isValidItlPhoneNumber(phoneNumber.value)) ||
                    authType === "receive" ||
                    (authType === "" &&
                      isValidItlPhoneNumber(phoneNumber.value))
                  )
                }
                isLoading={isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        ) : step === 2 ? (
          <div>
            <div className="text-gray">
              We sent a security code to {newPhone}.
              <br />
              Enter the code to continue.
            </div>
            <div className="row">
              <div className="col-6">
                <Input className="mt-2" placeholder="Security code" {...code} />
              </div>
            </div>
            {error && <Error>{error}</Error>}
            <div className="d-flex mt-3">
              <Button
                buttonType="button"
                className="ml-auto"
                size="large"
                type="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCode}
                className="ml-3"
                size="large"
                disabled={!code.value}
                isLoading={isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

const SecuritySetupContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 24px;
  font-size: 14px;
  line-height: 26px;
  font-weight: 400;
  .title {
    font-size: 16px;
    font-weight: 500;
  }
`;

const Heading = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #000;
`;

const Error = styled.div`
  margin-top: 12px;
  color: #cc4b39;
  font-size: 16px;
  text-align: center;
`;

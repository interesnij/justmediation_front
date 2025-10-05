import React, { useState, useEffect } from "react";
import { Modal, Button, MediatorContactSearch, InfoText } from "components";
import { validate } from "email-validator";
import { useInput } from "hooks"; 
import { useAuthContext, useCommonUIContext } from "contexts";
import { InviteNewUser } from "./fragments";
import { addContact } from "api";
import "./style.scss"; 

interface Props { 
  open: boolean;
  setOpen(param: boolean): void;
  onAdd?(params?): void;
  isForMatter?: boolean;
}

const headings = ["Create New Contact", "Invite New User"];
export const NewMediatorContactModal = ({
  open,
  setOpen,
  onAdd = () => {},
  isForMatter = false,
}: Props) => {
  const { showErrorModal } = useCommonUIContext();
  let reset = () => {};
  const [step, setStep] = useState(0);
  const userEmail = useInput("");
  const { userId, userType, profile } = useAuthContext();
  const [contact, setContact] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  console.log("NewMediatorContactModal");
  //console.log("bingo");
  useEffect(() => {
    if (open) {
      setStep(0); 
      userEmail.onChange("");
      setContact({});
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleBack = () => {
    setStep(0);
  };
  const handleNext = () => {
    setStep(1);
  };

  useEffect(() => {
    return () => {};
  }, [userEmail.value]);

  const handleAddContact = async () => {
    try {
      if (!isForMatter) {
        await addContact(userType, profile.role, userId, contact?.id);
      }

      onAdd(contact);
      setOpen(false)

      setIsLoading(true);
    } catch(error: any) {
      showErrorModal("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={headings[step]}
      onHeaderIconClick={handleBack}
      headerIcon={step === 1 ? "leftArrow" : ""}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        {step === 0 ? (
          <>
            <MediatorContactSearch
              {...userEmail}
              id={contact?.id}
              onSelect={setContact}
            />
            {validate(userEmail.value) && (
              <InfoText className="my-3">
                Don't see the person you are looking for?
                <br />
                Enter their email in the search bar and click "<strong>Invite new user</strong>" to invite them to the platform.
              </InfoText>
            )}
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
              {validate(userEmail.value) ? (
                <Button className="ml-3" size="large" onClick={handleNext}>
                  Invite New User
                </Button>
              ) : (
                <Button
                  className="ml-3"
                  disabled={!contact?.id}
                  size="large"
                  onClick={handleAddContact}
                  isLoading={isLoading}
                >
                  Add Contact
                </Button>
              )}
            </div>
          </>
        ) : (
          <InviteNewUser
            userEmail={userEmail.value}
            onAdd={newContact => {
              onAdd(newContact);
              setOpen(false);
            }}
            onClose={() => {
              setOpen(false);
            }}
          />
        )}
      </div>
    </Modal>
  );
};

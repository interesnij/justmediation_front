import React, { useState, useEffect } from "react";
import { Modal, Button, IndustryContactSearch } from "components";
import { useInput } from "hooks";
import { useAuthContext } from "contexts";
import { addIndustryContactToAttorney } from "api";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onAdd?(): void;
}
export const NewIndustryContactModal = ({
  open,
  setOpen,
  onAdd = () => {},
}: Props) => {
  let reset = () => {};
  const userEmail = useInput("");
  const { userId } = useAuthContext();
  const [contactId, setContactId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (open) {
      userEmail.onChange("");
      setContactId("");
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {};
  }, [userEmail.value]);

  const handleAddContact = async () => {
    setIsLoading(true);
    await addIndustryContactToAttorney(userId, contactId);
    onAdd();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Modal
      title={"Add New Contact"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        <IndustryContactSearch
          {...userEmail}
          id={contactId}
          onSelect={(item) => setContactId(item?.id)}
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
            disabled={!contactId}
            size="large"
            onClick={handleAddContact}
            isLoading={isLoading}
          >
            Add to Industry Contacts
          </Button>
        </div>
      </div>
    </Modal>
  );
};

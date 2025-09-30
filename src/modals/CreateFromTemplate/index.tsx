import React from "react";
import { Modal, Button, SearchBar } from "components";
import { useInput } from "hooks";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  matter?: number;
}
export const CreateFromTemplateModal = ({ open, setOpen, matter }: Props) => {
  let reset = () => {};
  const search = useInput("");

  return (
    <Modal
      title="Create from template"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        <SearchBar
          className="mt-1"
          icon="search"
          placeholder="Input keywords"
          {...search}
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
          <Button className="ml-3" buttonType="submit" size="large">
            Duplicate to current folder
          </Button>
        </div>
      </div>
    </Modal>
  );
};

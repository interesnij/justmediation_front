import React from "react";
import styled from "styled-components";
import { Modal } from "components";
import { useModal } from "hooks";
import { AddExpenseEntry, AddTimeEntry, AddFlatEntry } from "modals";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params: any): void;
  matter?: string | number;
  client?: string | number;
  data?: any;
  showFlat?: boolean;
}
export const AddBillingItemModal = ({
  open,
  setOpen,
  matter,
  client,
  data,
  onCreate = () => {},
  showFlat = false,
}: Props) => {
  let reset = () => {};
  const expenseModal = useModal();
  const timeModal = useModal();
  const flatModal = useModal();

  const clickType = (params: string) => {
    switch (params) {
      case "expense":
        expenseModal.setOpen(true);
        break;
      case "time":
        timeModal.setOpen(true);
        break;
      case "flat":
        flatModal.setOpen(true);
        break;

      default:
        break;
    }
  };

  const handleCreate = (params) => {
    onCreate(params);
    setOpen(false);
  };

  return (
    <Modal
      title={"Add Billing Item"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-post-modal">
        {showFlat ? (
          <div className="row">
            <div className="col-md-4">
              <UserType className="d-flex" onClick={() => clickType("flat")}>
                <div className="m-auto">Add Flat Fee</div>
              </UserType>
            </div>
            <div className="col-md-4">
              <UserType className="d-flex" onClick={() => clickType("expense")}>
                <div className="m-auto">Add Expense</div>
              </UserType>
            </div>
            <div className="col-md-4">
              <UserType className="d-flex" onClick={() => clickType("time")}>
                <div className="m-auto">Add Time</div>
              </UserType>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6">
              <UserType className="d-flex" onClick={() => clickType("expense")}>
                <div className="m-auto">Add Expense</div>
              </UserType>
            </div>
            <div className="col-md-6">
              <UserType className="d-flex" onClick={() => clickType("time")}>
                <div className="m-auto">Add Time</div>
              </UserType>
            </div>
          </div>
        )}
      </div>
      {
        expenseModal?.open &&
        <AddExpenseEntry
          {...expenseModal}
          onCreate={handleCreate}
          matter={matter}
          client={client}
          data={data}
          onClose={() => setOpen(false)}
        />
      }
      {
        timeModal?.open &&
        <AddTimeEntry
          {...timeModal}
          onCreate={handleCreate}
          matter={matter}
          client={client}
          data={data}
          onClose={() => setOpen(false)}
        />
      }
      {
        flatModal?.open &&
        <AddFlatEntry
          {...flatModal}
          onCreate={handleCreate}
          matter={matter}
          client={client}
          data={data}
          onClose={() => setOpen(false)}
        />
      }
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

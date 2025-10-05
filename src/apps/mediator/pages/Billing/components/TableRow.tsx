import React from "react";
import { Dropdown, User, Tag } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { format } from "date-fns";
import { useModal } from "hooks";
import {
  DeleteBillingModal,
  AddTimeEntry,
  AddExpenseEntry,
  InvoiceModal,
  AddFlatEntry
} from "modals";
import { navigate } from "@reach/router";
import { getUserName } from "helpers";
import { useTimerContext, useAuthContext } from "contexts";
import numeral from "numeral";
import "./../style.scss";

interface Props {
  data;
  isChecked?: boolean;
  onCheck?(params: any): void;
  onDelete?(): void;
}
export default function TableRow({
  data,
  isChecked = false,
  onCheck = () => {},
  onDelete = () => {},
}: Props) {
  const deleteModal = useModal();
  const timeModal = useModal();
  const expenseModal = useModal();
  const flatFeeModal = useModal();
  const invoiceModal = useModal();
  const { status, startTimer, stopTimer } = useTimerContext();
  const { userType } = useAuthContext();

  const handleActionClick = (params) => {
    switch (params) {
      case "edit":
        if (data?.billing_type === "time") {
          timeModal.setOpen(true);
        } else if(data?.billing_type === "flat_fee") {
          flatFeeModal.setOpen(true);
        } else {
          expenseModal.setOpen(true);
        }
        break;
      case "timer":
        if (status === "stopped") {
          startTimer();
        } else {
          stopTimer();
        }
        break;
      case "delete":
        deleteModal.setOpen(true);
        break;
      case "invoice":
        invoiceModal.setOpen(true);
        break;

      default:
        break;
    }
  };

  const rowActions2 = [
    {
      label: "Edit",
      action: "edit",
    },
    {
      label: "Delete entry",
      action: "delete",
    },
    {
      label: "Create an invoice",
      action: "invoice",
    },
  ];

  return (
    <div className={`billings-page__table-row ${isChecked ? "checked" : ""}`}>
      <div className="billings-page__table-row-item">
        <label className="check-box">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              onCheck(data);
            }}
          />
          <span/>
        </label>
      </div>
      <div className="billings-page__table-row-item">
        <Tag className="my-auto invoice" type={data?.billing_type} />
      </div>
      <div className="billings-page__table-row-item">
        <span>{data?.time_spent ?? "-"}</span>
      </div>
      <div className="billings-page__table-row-item">
        <span className="text-ellipsis">{data?.description}</span>
      </div>
      <div className="billings-page__table-row-item">
        <span>{data?.is_billable ? "Yes" : "No"}</span>
      </div>
      <div className="billings-page__table-row-item">
        <span className="text-ellipsis">{data?.matter_data?.title}</span>
      </div>
      <div className="billings-page__table-row-item">
        <User
          userName={getUserName(data?.client_data)}
          avatar={data?.client_data?.avatar}
        />
      </div>
      <div className="billings-page__table-row-item">
        <span>{numeral(data?.fees || 0).format("$0,0.00")}</span>
      </div>
      <div className="billings-page__table-row-item">
        <span>
          {data?.date ? format(new Date(data.date), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="billings-page__table-row-item">
        <User
          userName={`${data?.billed_by_data?.first_name ?? ""} ${
            data?.billed_by_data?.middle_name ?? ""
          } ${data?.billed_by_data?.last_name ?? ""}`}
          avatar={data?.billed_by_data?.avatar}
        />
      </div>
      <div className="billings-page__table-row-item">
        <Dropdown
          data={
            data?.billing_type === "time"
              ? [
                  {
                    label: "Edit",
                    action: "edit",
                  },
                  {
                    label: status === "stopped" ? "Start timer" : "Stop timer",
                    action: "timer",
                  },
                  {
                    label: "Delete entry",
                    action: "delete",
                  },
                  {
                    label: "Create an invoice",
                    action: "invoice",
                  },
                ]
              : rowActions2
          }
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="billings-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {data && (
        <>
          {
            deleteModal?.open &&
            <DeleteBillingModal {...deleteModal} data={data} onOk={onDelete} />
          }
          {
            timeModal?.open &&
            <AddTimeEntry
              {...timeModal}
              data={data}
              onCreate={onDelete}
              onUpdate={onDelete}
            />
          }
          {
            expenseModal?.open &&
            <AddExpenseEntry
              {...expenseModal}
              data={{
                ...data,
                attachment: data.attachment ? [data.attachment] : [],
              }}
              onCreate={onDelete}
              onUpdate={onDelete}
            />
          }
          {
            flatFeeModal?.open &&
              <AddFlatEntry
                {...flatFeeModal}
                data={data}
                onCreate={onDelete}
                onUpdate={onDelete}
              />
          }
          {
            invoiceModal?.open &&
            <InvoiceModal
              {...invoiceModal}
              defaultBilling={[data]}
              matter={data?.matter}
              client={data?.client}
              onCreate={() => navigate(`/${userType}/invoices`)}
            />
          }
        </>
      )}
    </div>
  );
}

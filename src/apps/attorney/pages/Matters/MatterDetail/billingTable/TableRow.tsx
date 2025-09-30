import React from "react";
import { Dropdown, User, Tag } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { useModal } from "hooks";
import { format } from "date-fns";
import {
  DeleteBillingModal,
  AddTimeEntry,
  AddExpenseEntry,
  InvoiceModal,
} from "modals";
import { useParams } from "@reach/router";
import { getUserName } from "helpers";
import { useTimerContext } from "contexts";
import numeral from "numeral";
import "./style.scss";

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
interface Props {
  data: any;
  isChecked?: boolean;
  onCheck?(params: number): void;
  onDelete?(): void;
  handleDelete?(): void;
  onUpdate?(): void;
}
export default function TableRow({
  data,
  isChecked = false,
  onCheck = () => {},
  onDelete = () => {},
  handleDelete = () => {},
  onUpdate = () => {}
}: Props) {
  const deleteModal = useModal();
  const timeModal = useModal();
  const expenseModal = useModal();
  const invoiceModal = useModal();
  const { status, startTimer, stopTimer } = useTimerContext();
  const params = useParams();

  const handleActionClick = (params) => {
    switch (params) {
      case "edit":
        if (data?.billing_type === "time") {
          timeModal.setOpen(true);
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

  return (
    <div className={`matter-billing-row ${isChecked ? "checked" : ""}`}>
      <div className="matter-billing-row-item">
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
      <div className="matter-billing-row-item">
        <Tag className="my-auto invoice" type={data?.billing_type} />
      </div>
      <div className="matter-billing-row-item">
        <span>{data?.time_spent ?? "-"}</span>
      </div>
      <div className="matter-billing-row-item">
        <span className="text-ellipsis" style={{ width: 280 }}>
          {data?.description}
        </span>
      </div>
      <div className="matter-billing-row-item">
        <span>{data?.is_billable ? "Yes" : "No"}</span>
      </div>

      <div className="matter-billing-row-item">
        <User
          userName={getUserName(data?.client_data)}
          avatar={data?.client_data?.avatar}
        />
      </div>
      <div className="matter-billing-row-item">
        <span>{numeral(data?.fees || 0).format("$0,0.00")}</span>
      </div>
      <div className="matter-billing-row-item">
        <span>
          {data?.date ? format(new Date(data.date), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="matter-billing-row-item">
        <User
          userName={`${data?.billed_by_data?.first_name ?? ""} ${
            data?.billed_by_data?.middle_name ?? ""
          } ${data?.billed_by_data?.last_name ?? ""}`}
          avatar={data?.billed_by_data?.avatar}
        />
      </div>
      <div className="matter-billing-row-item-action-btn">
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
            className="matter-billing-row-item-action"
          />
        </Dropdown>
      </div>
      {
        deleteModal?.open &&
        <DeleteBillingModal {...deleteModal} data={data} onOk={handleDelete} />
      }
      {
        timeModal?.open &&
        <AddTimeEntry {...timeModal} data={data} onCreate={onDelete} onUpdate={onUpdate} />
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
          onUpdate={onUpdate}
        />
      }
      {
        invoiceModal?.open &&
        <InvoiceModal
          matter={params.id}
          client={data?.client}
          defaultBilling={[data]}
          {...invoiceModal}
        />
      }
    </div>
  );
}

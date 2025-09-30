import React from "react";
import classNames from "classnames";
import "./style.scss";
const contentData = {
  attorney: "Attorney",
  paralegal: "Paralegal",
  client: "Client",
  lead: "Lead",
  enterprise: "Law Firm",
  admin: "Admin",
  draft: "DRAFT",
  active: "ACTIVE",
  completed: "COMPLETED",
  pending: "PENDING",
  revoked: "REVOKED",
  stage: "STAGE",
  open: "OPEN",
  closed: "CLOSED",
  close: "CLOSED",
  discovery: "DISCOVERY",
  referred: "REFERRED",
  referral: "REFERRED",
  // referral: "REFERRAL",
  "referral-request": "Referral Request",
  "referral-pending": "Referral Pending",
  "resend-invitation": "Resend Invitation",
  overdue: "Overdue",
  due: "Due",
  paid: "Paid",
  unpaid: "Unpaid",
  voided: "Voided",
  time: "Time",
  expense: "Expense",
  flat_fee: "Flat Fee",
};
interface Props {
  type:
    | "stage"
    | "open"
    | "closed"
    | "referral"
    | "discovery"
    | "referred"
    | "referral-request"
    | "referral-pending"
    | "pending"
    | "attorney"
    | "paralegal"
    | "client"
    | "lead"
    | "overdue"
    | "paid"
    | "unpaid"
    | "voided"
    | "time"
    | "expense"
    | "flat_fee"
    | "resend-invitation"
    | "date"
    | "custom"
    | "done";
  className?: string;
  isCustomContent?: boolean;
  children?: React.ReactNode;
  onClick?(): void;
}

export const Tag = ({
  type,
  children,
  className,
  isCustomContent = false,
  onClick = () => {},
}: Props) => {
  return (
    <div
      className={classNames("tag-control", "tag-control--" + type, className)}
      onClick={onClick}
    >
      {type === "date" || isCustomContent ? children : contentData[type]}
    </div>
  );
};

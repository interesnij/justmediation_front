import React from "react";
import { Dropdown, Tag } from "components";
import { Link, navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import numeral from "numeral";
import { format } from "date-fns";
import { duplicateInvoice } from "api";
import { useAuthContext } from "contexts";
import "./style.scss";

const rowActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Duplicate invoice",
    action: "duplicate",
  },
  {
    label: "Download",
    action: "download",
  },
];

interface Props {
  data: any;
  onUpdate?(): void;
}

export default function TableRow({ data, onUpdate = () => {} }: Props) {
  const { userType } = useAuthContext();
  const handleActionClick = async (params) => {
    switch (params) {
      case "view":
        navigate(`/${userType}/invoices/${data?.id}`);
        break;
      case "duplicate":
        await duplicateInvoice(data?.id);
        onUpdate();
        break;
      case "download":
        window.open(
          `${process.env.REACT_APP_API_URL}/api/v1/business/invoices/${data?.id}/export/`
        );
        break;

      default:
        break;
    }
  };

  return (
    <div className="matter-invoice-table-row">
      <div className="matter-invoice-table-row-item">
        <span className="mr-2">
          {numeral(
            data?.billing_items_data.reduce(
              (a, b) => ({
                fees: +a.fees + +b.fees,
              }),
              { fees: 0 }
            ).fees || 0
          ).format("$0,0.00")}
        </span>
        <Tag className="my-auto" type="open" />
      </div> 

      <div className="matter-invoice-table-row-item">
        <Link to={`/${userType}/invoices/${data?.id}`}>{data?.number}</Link>
      </div>

      <div className="matter-invoice-table-row-item">
        <span>
          {data?.period_end
            ? format(new Date(data?.period_end), "MM/dd/yyyy")
            : ""}
        </span>
      </div>
      <div className="matter-invoice-table-row-item">
        <span>
          {data?.created ? format(new Date(data?.created), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="matter-invoice-table-row-item">
        <Dropdown
          data={rowActions}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="matter-invoice-table-row-item-action"
          />
        </Dropdown>
      </div>
    </div>
  );
}

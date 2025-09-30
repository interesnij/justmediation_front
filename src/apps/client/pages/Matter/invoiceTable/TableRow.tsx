import React from "react";
import { Dropdown, Tag } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import numeral from "numeral";
import { format } from "date-fns";
import { payInvoice } from "api";
import { navigate } from "@reach/router";
import { useCommonUIContext } from "contexts";
import "./style.scss";

const rowActions = [
  {
    label: "Download PDF",
    action: "download",
  },
  {
    label: "Make Payment",
    action: "payment",
  },
];
export default function TableRow({ data, onUpdate = () => {} }) {
  const { showErrorModal } = useCommonUIContext();
  const handleActionClick = async (params) => {
    switch (params) {
      case "payment":
        try {
          const res:any = await payInvoice(data?.id);
          if (res?.status !== 200)
            showErrorModal("Error", res);
        } catch (error) {
          showErrorModal("Error", error);
        }
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

  const handleClick = () => {
    navigate(`/client/overview/invoice/${data?.id}`);
  };

  return (
    <div className="client-matter-invoice-table-row">
      <div className="client-matter-invoice-table-row-item">
        <span className="mr-2">{numeral(130.29).format("$0,0.00")}</span>
        <Tag className="my-auto" type="open" />
      </div>

      <div
        className="client-matter-invoice-table-row-item cursor-pointer"
        onClick={handleClick}
      >
        <span className="my-auto">{data?.number}</span>
      </div>
      <div
        className="client-matter-invoice-table-row-item cursor-pointer "
        onClick={handleClick}
      >
        <span className="my-auto">{data?.title}</span>
      </div>

      <div
        className="client-matter-invoice-table-row-item cursor-pointer"
        onClick={handleClick}
      >
        <span>
          {data?.period_end
            ? format(new Date(data?.period_end), "MM/dd/yyyy")
            : ""}
        </span>
      </div>
      <div className="client-matter-invoice-table-row-item">
        <span>
          {data?.created ? format(new Date(data?.created), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="client-matter-invoice-table-row-item">
        <Dropdown
          data={rowActions}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="client-matter-invoice-table-row-item-action"
          />
        </Dropdown>
      </div>
    </div>
  );
}

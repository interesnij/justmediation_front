import React from "react";
import { Dropdown, User, Tag } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import numeral from "numeral";
import { getUserName } from "helpers";
import { navigate } from "@reach/router";
import { payInvoice } from "api";
import { useCommonUIContext } from "contexts";
import "./../style.scss";
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
    <div className="client-invoice-table-row">
      <div className="client-invoice-table-row-item">
        <span className="mr-2">
          {numeral(data?.fees_earned).format("$0,0.00")}
        </span>
        <Tag className="my-auto status" type={data?.status} />
      </div>
      <div
        className="client-invoice-table-row-item cursor-pointer"
        onClick={handleClick}
      >
        <span className="my-auto">{data?.number}</span>
        {/* <Link to="/mediator/invoice/a">C972607</Link> */}
      </div>

      <div
        className="client-invoice-table-row-item cursor-pointer"
        onClick={handleClick}
      >
        <User
          userName={getUserName(data?.client_data)}
          avatar={data?.client_data?.avatar}
        />
      </div>
      <div
        className="client-invoice-table-row-item cursor-pointer"
        onClick={handleClick}
      >
        <span className="text-ellipsis">{data?.matter_data?.title}</span>
      </div>
      <div className="client-invoice-table-row-item">
        <span>{data?.period_end}</span>
      </div>
      <div className="client-invoice-table-row-item">
        <Dropdown
          data={rowActions}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="client-invoice-table-row-item-action"
          />
        </Dropdown>
      </div>
    </div>
  );
}

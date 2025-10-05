import React from "react";
import { Dropdown, User, Tag } from "components";
import {duplicateInvoice, deleteInvoice} from "api";
import { Link, navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import numeral from "numeral";
import { format } from "date-fns";
import { getUserName } from "helpers";
import { downloadInvoice } from "api";
import { useContextSubscriptionAccess} from "contexts";
import "./../style.scss"

const menuActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Duplicate invoice",
    action: "duplicate",
  },
  {
    label: "Download PDF",
    action: "download",
  }
];

const draftMenuActions = [
  {
    label: "Edit",
    action: "edit",
  },
  {
    label: "Duplicate invoice",
    action: "duplicate",
  },
//  { [NEED] export endpoint broken for draft invoices 
//    label: "Download PDF",
//    action: "download",
//  },
  {
    label: "Delete draft",
    action: "delete",
  }
]

interface Props {
  data: any;
  onUpdate?(): void;
  openEdit?(id: number): void;
  userType: string;
}

export default function TableRow({ 
  data, 
  onUpdate = () => {}, 
  openEdit = () => {},
  userType 
}: Props) {
  const { hasSubscription } = useContextSubscriptionAccess();

  const handleActionClick = async (params) => {
    switch (params) {
      case "edit":
        openEdit(data?.id);
        break;
      case "view":
        await navigate(`/${userType}/invoices/${data?.id}`);
        break;
      case "duplicate":
        await duplicateInvoice(data?.id);
        onUpdate();
        break;
      case "download":
        const url = await downloadInvoice(data?.id);
        window.open(url);
        break;
      case "delete":
        await deleteInvoice(data?.id);
        onUpdate();
        break;
      default:
        break;
    }
  };

  const getDropdownActions = () => {

   if(data.status === 'draft') {
     return hasSubscription ? draftMenuActions : [{
       label: "View",
       action: "view",
     }]
   } else {
     return hasSubscription ? menuActions : menuActions.filter(item => item.action !== "duplicate");
   }
  }

  return (
    <div className="invoices-page__table-row">
      <div className="invoices-page__table-row-item">
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
        <Tag className="my-auto status" type={data?.status} />
      </div>
      <div className="invoices-page__table-row-item text-ellipsis">
        {data?.status === "draft" && hasSubscription ?
          <span className="cursor-pointer" onClick={() => openEdit(data?.id)}>{data?.number}</span> :
          <Link to={`/${userType}/invoices/${data?.id}`}>{data?.number}</Link>
        }
      </div>
      <div className="invoices-page__table-row-item">
        <User
          userName={getUserName(data?.client_data)}
          avatar={data?.client_data?.avatar}
        />
      </div>
      <div className="invoices-page__table-row-item">
        <span className="text-ellipsis">{data?.matter_data?.title}</span>
      </div>
      <div className="invoices-page__table-row-item">
        <span>{data?.period_end ? format(new Date(data?.period_end), "MM/dd/yyyy") : ""}</span>
      </div>
      <div className="invoices-page__table-row-item">
        <span>
          {data?.created ? format(new Date(data?.created), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="invoices-page__table-row-item">
        <Dropdown
          data={getDropdownActions()}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="invoices-page__table-row-item-action"
          />
        </Dropdown>
      </div>
    </div>
  );
}

import React from "react";
import { Dropdown, User, Tag } from "components";
import { navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import { format } from "date-fns";
import styled from "styled-components";
import { useModal } from "hooks";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import {
  InvoiceModal,
  NewMessageModal,
  AddBillingItemModal,
} from "modals";
import { getUserName } from "helpers";
import "./style.scss";

const rowActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Start a call",
    action: "call",
  },
  {
    label: "Create a message",
    action: "message",
  },
  {
    label: "Create an invoice",
    action: "invoice",
  },
  {
    label: "Add billable items",
    action: "bill",
  },
];
export default function TableRow(matter: any) {
  const invoiceModal = useModal();
  const billModal = useModal();
  const messageModal = useModal();
  const { userType } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();

  const handleNameClick = () => {
    hasSubscription && navigate(`/${userType}/matters/${matter.id}`);
  };
  const handleActionClick = (params: string) => {
    switch (params) {
      case "view":
        handleNameClick();
        break;
      case "call":
        break;
      case "message":
        messageModal.setOpen(true);
        break;
      case "invoice":
        invoiceModal.setOpen(true);
        break;
      case "bill":
        billModal.setOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="lead-matters-page__table-row">
      <div className="lead-matters-page__table-row-item matter-name">
        <span className="mr-1 text-ellipsis" onClick={handleNameClick}>
          {matter.title}
        </span>
        {matter.status === "refer" && <Tag type="referral-request" />}
      </div>

      <div className="lead-matters-page__table-row-item">
        <Tag className="status" type={matter?.status} />
      </div>
      <div className="lead-matters-page__table-row-item">
        <span>{matter?.rate_type?.title.replace("rates", "")}</span>
      </div>
      <div className="lead-matters-page__table-row-item">
        <span>{matter?.speciality_data?.title}</span>
      </div>
      <div className="lead-matters-page__table-row-item">
        <span>
          {matter.created ? format(new Date(matter.created), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="lead-matters-page__table-row-item">
        <User avatar={matter?.attorney_data?.avatar} />
        <Name className="ml-1">
          {`${matter?.attorney_data?.first_name} ${matter?.attorney_data?.last_name}`}
        </Name>
      </div>
      {hasSubscription && <div className="lead-matters-page__table-row-item">
          <Dropdown
              data={rowActions}
              className="mx-auto"
              onActionClick={handleActionClick}
          >
              <img
                  src={ActionIcon}
                  alt="action"
                  className="lead-matters-page__table-row-item-action"
              />
          </Dropdown>
      </div>}

      {matter && (
        <>
          {
            invoiceModal?.open &&
            <InvoiceModal
              {...invoiceModal}
              matter={matter?.id}
              client={matter?.client}
            />
          }
          {
            billModal?.open &&
            <AddBillingItemModal
              {...billModal}
              matter={matter?.id}
              client={matter?.client}
            />
          }
          {
            messageModal?.open &&
            <NewMessageModal
              {...messageModal}
              matter={matter?.id}
              data={matter}   
            />
          }
        </>
      )}
    </div>
  );
}

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

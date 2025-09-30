import React from "react";
import { Dropdown, User, Tag } from "components";
import { navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import { format, parseISO } from "date-fns";
import styled from "styled-components";
import { useModal } from "hooks";
import {
  NewMatterNoteModal,
  NewMessageModal,
  AddBillingItemModal,
  InvoiceModal,
  ReferMatterModal,
  DeleteMatterModal,
  LeaveMatterModal,
  ShareWithModal,
} from "modals";
import { getUserName } from "helpers";
import { useAuthContext } from "contexts";
import "./../style.scss";

const rowActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Share with",
    action: "share",
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
    label: "Create note",
    action: "note",
  },
  {
    label: "Add billable items",
    action: "bill",
  },
  {
    label: "Create an invoice",
    action: "invoice",
  },
  {
    label: "Refer matter",
    action: "refer",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
const rowActions2 = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Create a message",
    action: "message",
  },
  {
    label: "Create note",
    action: "note",
  },
  {
    label: "Add billable items",
    action: "bill",
  },
  {
    label: "Create an invoice",
    action: "invoice",
  },

  {
    label: "Leave matter",
    action: "leave",
  },
];
export default function TableRow({ matter, onUpdate = () => {} }) {
  const noteModal = useModal();
  const messageModal = useModal();
  const billingModal = useModal();
  const invoiceModal = useModal();
  const referModal = useModal();
  const deleteModal = useModal();
  const leaveModal = useModal();
  const shareModal = useModal();
  const { userType } = useAuthContext();
  const handleNameClick = () => {
    navigate(`/${userType}/matters/${matter.id}`);
  };
  const handleActionClick = (params: string) => {
    switch (params) {
      case "view":
        handleNameClick();
        break;
      case "share":
        shareModal.setOpen(true);
        break;
      case "message":
        messageModal.setOpen(true);
        break;
      case "note":
        noteModal.setOpen(true);
        break;
      case "bill":
        billingModal.setOpen(true);
        break;
      case "invoice":
        invoiceModal.setOpen(true);
        break;
      case "refer":
        referModal.setOpen(true);
        break;
      case "delete":
        deleteModal.setOpen(true);
        break;
      case "leaveModal":
        leaveModal.setOpen(true);
        break;
      default:
        break;
    }
  };
  return (
    <div className="matters-page__table-row">
      <div className="matters-page__table-row-item matter-name">
        <span className="mr-1 text-ellipsis" onClick={handleNameClick}>
          {matter?.title}
        </span>
        {matter?.referral_request && <Tag type="referral-request" />}
        {matter?.referral_pending && <Tag type="referral-pending" />}
      </div>
      <div className="matters-page__table-row-item">
        <User avatar={matter?.client_data?.avatar} />
        <Name className="ml-1">{getUserName(matter?.client_data)}</Name>
      </div>
      <div className="matters-page__table-row-item">
        <Tag type={matter?.status} className="status"/>
      </div>
      <div className="matters-page__table-row-item">
        <span>{matter?.rate_type?.title.replace("rates", "")}</span>
      </div>
      <div className="matters-page__table-row-item">
        <span className="text-ellipsis" style={{ maxWidth: 200 }}>
          {matter?.speciality_data?.title}
        </span>
      </div>
      <div className="matters-page__table-row-item">
        <span>
          {matter.start_date ? format(parseISO(matter.start_date), "MM/dd/yyyy") : ""}
        </span>
      </div>
      <div className="matters-page__table-row-item">
        <User avatar={matter?.attorney_data?.avatar} />
        <Name className="ml-1">
          {`${matter?.attorney_data?.first_name} ${matter?.attorney_data?.last_name}`}
        </Name>
      </div>
      <div className="matters-page__table-row-item">
        <Dropdown
          data={!matter?.is_shared ? rowActions : rowActions2}
          className="mx-auto"
          onActionClick={handleActionClick}
        >
          <img
            src={ActionIcon}
            alt="action"
            className="matters-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {matter && (
        <>
          {
            noteModal?.open &&
            <NewMatterNoteModal {...noteModal} matter={matter?.id} />
          }
          {
            messageModal?.open &&
            <NewMessageModal
              {...messageModal}
              matter={matter?.id}
              data={matter}   
            />
          }
          {
            billingModal?.open &&
            <AddBillingItemModal
              {...billingModal}
              matter={matter?.id}
              client={matter?.client}
            />
          }
          {
            invoiceModal?.open &&
            <InvoiceModal
              {...invoiceModal}
              matter={matter?.id}
              client={matter?.client}
            />
          }
          {
            deleteModal?.open &&
            <DeleteMatterModal
              {...deleteModal}
              matter={matter?.id}
              onOk={() => onUpdate()}
            />
          }
          {
            leaveModal?.open &&
            <LeaveMatterModal
              {...leaveModal}
              matter={matter?.id}
              onOk={() => navigate(`/${userType}/matters`)}
            />
          }
          {
            referModal?.open &&
            <ReferMatterModal 
              {...referModal} 
              matterData={matter}
              onAdd={() => onUpdate()} 
            />
          }
          {
            shareModal?.open &&
            <ShareWithModal {...shareModal} matter={matter.id} />
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

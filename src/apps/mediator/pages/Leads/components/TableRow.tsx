import React, { useState } from "react";
import { Dropdown, User, Tag } from "components";
import { navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import { capitalize } from "lodash";
import { useModal } from "hooks";
import { formatPhoneNumber, getUserName } from "helpers";
import { createChat, resendInviteLead } from "api";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import {
  NewMatterModal,
  AddBillingItemModal,
  InvoiceModal,
  DeleteClientModal,
  EditContactModal,
  ShareContactModal,
} from "modals";
import "./../style.scss";

let rowActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Create new matter",
    action: "matter",
  },
  {
    label: "Direct Chat",
    action: "chat",
  },
  //{
  //  label: "Start a call",
  //  action: "call",
  //},
  {
    label: "Add billable items",
    action: "bill",
  },
  {
    label: "Create an invoice",
    action: "invoice",
  },
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Edit Contact",
    action: "edit",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
let pendingActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Create new matter",
    action: "matter",
  },
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Edit Contact",
    action: "edit",
  },
  {
    label: "Delete",
    action: "delete",
  },
];

interface Props {
  data: any;
  onUpdate?(): void;
}

export default function TableRow({ data = {}, onUpdate = () => {} }: Props) {
  const { userType } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  const matterModal = useModal();
  const billModal = useModal();
  const invoiceModal = useModal();
  const deleteModal = useModal();
  const editModal = useModal();
  const shareModal = useModal();

  const viewProfile = () => navigate(
    `/${userType}/leads/${data?.id}?type=${
      data?.is_pending ? "pending" : data?.type
    }`
  );

  const handleResentInvitation = async () => {
    await resendInviteLead(data?.id);
  };

  const handleActionClick = async (params) => {
    switch (params) {
      case "view":
        viewProfile();
        break;
      case "chat":
        let res = await createChat({
          participants: [data?.id],
          is_group: 0,
        });
        if (data?.type === "client") {
          navigate(`/${userType}/chats/clients?id=${res?.id}`);
        } else {
          navigate(`/${userType}/chats/leads?id=${res?.id}`);
        }
        break; 
      case "call":
        break;
      case "matter":
        matterModal.setOpen(true);
        break;
      case "bill":
        billModal.setOpen(true);
        break;
      case "invoice":
        invoiceModal.setOpen(true);
        break;
      case "share":
        shareModal.setOpen(true);
        break;
      case "edit":
        editModal.setOpen(true);
        break;
      case "delete":
        deleteModal.setOpen(true);
        break;
      default:
        break;
    }
  };

  const findViewAction = (arr) => {
    return [arr.find(item => item.action === "view")]
  }
  const createDropdownMenuList = () => {

    if(!hasSubscription) {
      return data?.is_pending ? findViewAction(pendingActions) : findViewAction(rowActions)
    }

    if(data?.is_pending) {
      return pendingActions
    } else if(data?.matters_count > 0) {
      return rowActions.filter((a) => a.action !== "delete")
    } else {
      return rowActions
    }
  }

  return (
    <div className="leads-page__table-row">
      <div className="leads-page__table-row-item lead-name">
        <User
          avatar={data?.avatar}
          userName={getUserName(data)}
          onClick={viewProfile}
        />
        {data?.is_pending && (
          <PendingTag onSendInvitation={handleResentInvitation} />
        )}
      </div>
      <div className="leads-page__table-row-item">
        <span className="my-auto">{data?.company || "-"}</span>
      </div>
      <div className="leads-page__table-row-item">
        <span className="my-auto">{capitalize(data?.type)}</span>
      </div>
      <div className="leads-page__table-row-item">
        <span>{data?.phone ? formatPhoneNumber(data.phone) : "-"}</span>
      </div>
      <div className="leads-page__table-row-item">
        <span>{data?.email}</span>
      </div>
      <div className="leads-page__table-row-item">
        <span>{`${data?.matters_count} matters`}</span>
      </div>
      <div className="leads-page__table-row-item">
        <Dropdown
          data={createDropdownMenuList()}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="leads-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {data && (
        <>
          {
            matterModal?.open &&
            <NewMatterModal
              {...matterModal}
              client={data?.id}
              clientData={{
                name: getUserName(data),
                company: data?.company,
                job: data?.job,
                phone: data?.phone,
                email: data?.email,
                avatar: data?.avatar,
              }}
            />
          }
          {
            billModal.open &&
            <AddBillingItemModal {...billModal} client={data?.id} />
          }
          {
            invoiceModal.open &&
            <InvoiceModal {...invoiceModal} client={data?.id} />
          }
          {
            deleteModal.open &&
            <DeleteClientModal
              type={data?.type === "lead" ? "lead" : "client"}
              {...deleteModal}
              data={data}
              onOk={onUpdate}
            />
          }
          {
            editModal?.open &&
            <EditContactModal
              data={{
                first_name: data?.first_name,
                middle_name: data?.middle_name,
                last_name: data?.last_name,
                email: data?.email,
                phone: data?.phone,
                country: data?.country,
                state: data?.state,
                city: data?.city,
                zip_code: data?.zip_code,
                client_type: data?.type,
                note: data?.note,
              }}
              contactId={data.id}
              isPending={data?.is_pending}
              onUpdate={() => onUpdate()}
              {...editModal}
            />
          }
          {
            shareModal?.open &&
            <ShareContactModal
              {...shareModal}
              contactId={data?.id}
              isPending={data?.is_pending}
            />
          }
        </>
      )}
    </div>
  );
}

interface PendingTagProps {
  className?: string;
  onSendInvitation?(): void;
}

const PendingTag = ({
  className,
  onSendInvitation = () => {},
}: PendingTagProps) => {
  const [state, setState] = useState(false);
  const handleClick = () => {
    if (state) {
      onSendInvitation();
    }
    setState((state) => !state);
  };
  return (
    <div className={className} onClick={handleClick}>
      {!state ? <Tag type="pending" /> : <Tag type="resend-invitation" />}
    </div>
  );
};

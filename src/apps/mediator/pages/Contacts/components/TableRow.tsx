import React from "react";
import { Dropdown, User, Tag } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { navigate } from "@reach/router";
import { useModal } from "hooks";
import { DeleteIndustryContactModal } from "modals";
import { useAuthContext } from "contexts";
import { createChat } from "api";
import "./../style.scss";

const rowActions = [
  {
    label: "View Profile",
    action: "view",
  },
  {
    label: "Direct chat",
    action: "chat",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
const pendingRowActions = [
  {
    label: "Delete",
    action: "delete",
  },
];

interface Props {
  contact: any;
  onDelete?(): void;
}

export default function TableRow({ contact, onDelete = () => {} }: Props) {
  const { userType } = useAuthContext();  
  const deleteModal = useModal();
  const handleNameClick = () => {
    if (!contact?.pending) {
      navigate(`/${userType}/contacts/${contact?.user_id}`);
    }
  };

  const handleActionClick = async (params) => {
    switch (params) {
      case "view":
        navigate(`/${userType}/contacts/${contact?.user_id}`);
        break;
      case "chat":
        const chat = await createChat({ participants: [contact?.user_id] })
        navigate(`/${userType}/chats/network?id=${chat?.id}`);
        break;
      case "delete":
        deleteModal.setOpen(true);
        break;

      default:
        break;
    }
  };

  return (
    <div className="contacts-page__table-row">
      <div
        className="contacts-page__table-row-item contact-name cursor-pointer"
        onClick={handleNameClick}
      >
        <User
          avatar={contact?.avatar}
          userName={contact?.name}
          className="my-auto contact-name"
        />
        {contact?.pending && <Tag type="pending" className="my-auto" />}
      </div>
      <div
        className="contacts-page__table-row-item cursor-pointer"
        onClick={handleNameClick}
      >
        <span className="my-auto">{contact?.firm || " - "}</span>
      </div>
      <div className="contacts-page__table-row-item">
        <Tag type={contact?.type} className="my-auto" />
      </div>
      <div className="contacts-page__table-row-item">
        <Dropdown
          onActionClick={handleActionClick}
          data={contact?.pending ? pendingRowActions : rowActions}
          className="my-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="contacts-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {
        deleteModal?.open &&
        <DeleteIndustryContactModal
          {...deleteModal}
          contactId={contact?.user_id}
          onOk={onDelete}
        />
      }
    </div>
  );
}

import React, {useCallback} from "react";
import {Attachment, Dropdown, User} from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import {navigate, useParams} from "@reach/router";
import {useAuthContext} from "contexts";
import {format} from "date-fns";
import {getUserName} from "helpers";
import {markReadMatterPost, markUnreadMatterPost} from "api";

import {DeleteMessageModal} from "modals";
import {useModal} from "hooks";

interface Props {
  message: any;
  onUpdate?(): void;
}

export default function TableRow({ message, onUpdate = () => {} }: Props) {
  const params = useParams();
  const deleteModal = useModal();
  const {userType} = useAuthContext();

  const handleClickRow = () => {
    navigate(`/${userType}/matters/${params.id}/message/${message.id}`);
  };

  const handleActionClick = async (params) => {
    switch (params) {
      case "unread":
        await markUnreadMatterPost(message?.id);
        onUpdate();
        break;
      case "read":
        await markReadMatterPost(message?.id);
        onUpdate();
        break;
      case "delete":
        deleteModal.setOpen(true);
        onUpdate();
        break;
      default:
        break;
    }
  };

  const doubleRow: boolean = message?.last_comment?.attachments_data && message?.last_comment?.attachments?.length > 0

  const rowActions = useCallback(() => {
    return [
      message.seen ? {
        label: "Mark as Unread",
        action: "unread",
      } : {
        label: "Mark as Read",
        action: "read",
      },
      {
        label: "Delete",
        action: "delete",
      },
    ]
  }, [message.seen]);

  return (
    <div className={`client-matter-message-page__table-row ${doubleRow ? "double-row" : ""}`}>
      <div
        className="client-matter-message-page__table-row-item"
        onClick={handleClickRow}
      >
        <User
          userName={getUserName(message?.last_comment?.author)}
          avatar={message?.last_comment?.author?.avatar}
        />
      </div>
      <div
        className="client-matter-message-page__table-row-item"
        onClick={handleClickRow}
      >
        <span
          className={`text-ellipsis ${
            message?.seen ? "text-dark" : "text-bold text-black"
          }`}
        >
          {message?.title}
        </span>
      </div>
      <div
        className="client-matter-message-page__table-row-item"
        onClick={handleClickRow}
      >

      <div
          className={`text-ellipsis ${
            message?.seen ? "text-dark" : "text-bold text-black"
          }`}
        >
          {message?.last_comment?.text}
        </div>
      </div>

      <div className="client-matter-message-page__table-row-item-action-cell">
        <span>
          {message?.modified
            ? format(new Date(message.modified), "MM/dd/yyyy hh:mm:ss a")
            : ""}
        </span>
      </div>
      <div className="client-matter-message-page__table-row-item-action-cell">
        <Dropdown
          data={rowActions()}
          onActionClick={handleActionClick}
        >
          <img
            src={ActionIcon}
            alt="action"
            className="client-matter-message-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {doubleRow &&
        <>
          <div />
          <div className="client-matter-message-page__table-row-item-attachments">
            {message?.last_comment?.attachments_data?.map((key, index) => {
              if(index > 2) {
                return (
                  <div className="client-matter-message-page__table-row-item-attachments-item">
                    +{message?.last_comment?.attachments_data?.length - 3}
                  </div>
                )
              }
              return (
                <div className="client-matter-message-page__table-row-item-attachments-item">
                  <Attachment key={key?.file_name} name={key?.file_name || `doc_${index}`} size={key?.file_size || "0KB"}/>
                </div>
              )
            })}
        </div>
        </>
      }

      {
        deleteModal?.open &&
          <DeleteMessageModal
            {...deleteModal}
            id={message?.id}
            onDelete={onUpdate}
          />
      }

    </div>
  );
}

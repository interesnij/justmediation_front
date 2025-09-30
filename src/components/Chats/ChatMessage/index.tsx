import React from "react";
import classNames from "classnames";
import { User, ChatAttachment, ChatVoiceMessage, ChatVideoCall, ProposalMessage } from "components";
import { ProfileSideModal } from "modals";
import { useModal } from "hooks";
import { format } from "date-fns";
import { useAuthContext } from "contexts";
import { navigate } from "@reach/router";
import "./style.scss";

interface MsgProps {
  data?: any;
  userInfo?: any;
  participants?: {
    id: number;
    avatar: string;
  }[]
}

export const ChatMessage = ({ data, userInfo, participants }: MsgProps) => {
  const profileModal = useModal();
  const { userId } = useAuthContext();
  let sendType = +data.author === +userId ? "send" : "receive",
    type = data.type || "text",
    name = `${userInfo?.first_name ?? ""} ${userInfo?.middle_name ?? ""} ${
      userInfo?.last_name ?? ""
    }`,
    startTime = data?.created
      ? format(new Date(data.created), "MM/d/yy hh:mm:ss a")
      : "";
  const handleView = () => {
    profileModal.setOpen(false);
  };

  const handleChat = () => {
    profileModal.setOpen(false);
  };
  const handleCall = () => {
    profileModal.setOpen(false);
  };

  const isNotMyMessage = +userId !== userInfo?.id;

  return (
    <div className="d-flex">
      <div
        className={classNames(
          "chat-message__container",
          sendType === "receive"
            ? "chat-message__container--left"
            : "chat-message__container--right"
        )}
      >
        <User
          size="normal"
          avatar={userInfo?.avatar}
          onClick={() => isNotMyMessage && profileModal.setOpen(true)}
          className={isNotMyMessage ? "cursor-pointer" : ""}
        />

        <div className="mx-2">
          <div
            className={
              sendType === "receive"
                ? "justify-content-start"
                : "justify-content-end"
            }
          >
            {sendType === "receive" ? (
              <>
                <span className="chat-message__name">{name}</span>
                <span className="chat-message__time mx-1">{startTime}</span>
              </>
            ) : (
              <>
                <span className="chat-message__time mx-1">{startTime}</span>
                <span className="chat-message__name">{name}</span>
              </>
            )}
          </div>
          {
            type === "text" && data.text ? (
              <TextContent text={data.text} />
            ) : type === "voice" ? (
              <ChatVoiceMessage {...data.files[0]} size={data.text || 0} />
            ) : type === 'endCall' ? (
              <ChatVideoCall 
                {...JSON.parse(data.text)}
                ended={data.created}
                allParticipants={participants}
              />
            ) : type === 'proposal' ? (
              <ProposalMessage
                data={data.text}
              />
            ) : null
          }
          <div>
            {type === 'text' && data.files && data.files.map((attachment, index) => (
              <ChatAttachment
                {...attachment}
                sendType={sendType}
                key={`${index}key`}
                userId={userId}
              />
            ))}
          </div>
        </div>
      </div>
      {
        profileModal?.open &&
        <ProfileSideModal
          {...profileModal}
          data={userInfo}
          onView={handleView}
          onChat={handleChat}
          onCall={handleCall}
        />
      }
    </div>
  );
};

interface ITextContent {
  text?: string;
}
const TextContent = ({ text }: ITextContent) => {
  return (
    <div className="chat-message__content chat-message__content--text">
      {text}
    </div>
  );
};

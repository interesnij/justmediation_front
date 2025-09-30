import React from "react";
import { useModal, useInput } from "hooks";
import { NewChatModal, NewClientChatModal, ChatArchiveModal } from "modals";
import { SearchBar, IconButton } from "components";
import { useAuthContext } from "contexts";
import "./style.scss";

interface Props {
  className?: string;
  onCreate?(params: string): void;
  chatLists?: any[];
  isListLoading?: boolean;
  forceRefetchLists?(): void;
}

export const ChatHeader = ({
  className,
  onCreate = () => {},
  chatLists = [],
  isListLoading = false,
  forceRefetchLists = () => {}
}: Props) => {
  const { userType } = useAuthContext();
  const chatModal = useModal();
  const chatArchiveModal = useModal();
  const search = useInput("");

  return (
    <div className={`chat-page__header ${className}`}>
      {/*
      <SearchBar
        icon="search"
        placeholder="Search in chats"
        className="my-auto"
        {...search}
      />
      */}
      <IconButton
        type="archive"
        toolTip="Archive folder"
        className="ml-3 my-auto"
        onClick={() => chatArchiveModal.setOpen(true)}
      />
      <IconButton
        type="chat"
        toolTip="Start a new chat"
        className="ml-3 my-auto"
        onClick={() => chatModal.setOpen(true)}
      />
      {userType === 'client' ? (
        <NewClientChatModal {...chatModal} onCreate={onCreate} />
      ) : (
        <NewChatModal {...chatModal} onCreate={onCreate} />
      )}
      <ChatArchiveModal 
        {...chatArchiveModal} 
        chatLists={chatLists}
        isListLoading={isListLoading} 
        forceRefetchLists={forceRefetchLists}
      />
    </div>
  );
};

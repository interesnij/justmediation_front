import React, { useEffect, useState } from "react";
import { ChatContent, FullScreenModal, filterChatData, ChatSidebar, RiseLoader } from "components";
import { useAuthContext, useChatContext } from "contexts";
import { useInput } from "hooks";
import { navigate } from "@reach/router";
import { useQuery } from "react-query";
import { getChatById, updateChat } from "api";
import { filterChatList } from "helpers";
import { sortChatData } from "config";
import "./index.scss"

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  chatLists: any[];
  isListLoading: boolean;
  forceRefetchLists?(): void;
}
export const ChatArchiveModal = ({
  open,
  setOpen,
  chatLists = [],
  isListLoading,
  forceRefetchLists = () => {}
}: Props) => {
  const { profile, userType } = useAuthContext();
  const sortBy = useInput(sortChatData[0].id);
  const filterBy = useInput(filterChatData[0].id);
  const [id, setId] = useState(0);
  const [isUpdating, setUpdating] = useState(false);
  const [archiveLists, setArchiveLists] = useState<any[]>(chatLists)
  const { resetUnreads } = useChatContext();
  const [isUpdatingSidebar, setUpdatingSidebar] = useState(false)
  
  useEffect(() => {
    updateChatLists()
  }, [chatLists])

  useEffect(() => {
    if (!+id) return;
    refetchChat();
  }, [id])

  useEffect(() => {
    if (isListLoading) return;
    setId(0);
    updateChatLists();
  }, [sortBy.value, filterBy.value]);

  const updateChatLists = () => {
    setArchiveLists(
      filterChatList(
        chatLists, 
        userType === 'client' ? false : filterBy.value, 
        sortBy.value
      )
    )
  }

  // fetch chat by id
  const { 
    data: chatData, 
    isLoading: isChatLoading, 
    refetch: refetchChat 
  } = useQuery<any, Error>(
    [`archive-${filterBy.value}-chat-${id}`, id],
    () => {
        if (!id) return;
        return getChatById(id)
    },
    {
      keepPreviousData: true,
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (!chatData?.chat_channel) return;
    resetUnreads(chatData.chat_channel);
    //updateTransitionMenu(chatData);
  }, [chatData?.chat_channel])

  const handleStarClick = async (id: number, isFavorite: boolean) => {
    setUpdatingSidebar(true)
    const { data: success } = await updateChat(id, {is_favorite: !isFavorite});
    if (success)
      setArchiveLists(
        archiveLists.map(item => {
          if (item?.id === id)
            item.is_favorite = !isFavorite;
          return item;
        })
      )
    setUpdatingSidebar(false)
  }

  const handleDeleteChat = async () => {
    forceRefetchLists();
    setId(0);
  }

  const handleUnarchive = async () => {
    setUpdating(true)
    await updateChat(chatData?.id, {is_archived: false})
    forceRefetchLists();
    setUpdating(false)
    setOpen(false);
    userType === 'client'
      ? navigate(`/client/chats/${chatData?.id}`)
      : navigate(`/${userType}/chats/${filterBy.value}?id=${chatData?.id}`);
  }

  return (
    <FullScreenModal
      title="Archive"
      theme="white"
      noFooter={true}
      open={open}
      className="archive-modal"
      setOpen={(param) => {
        setOpen(param);
      }}
    >
        <div className="archive-chat-page">
            <ChatSidebar
                data={archiveLists}
                isLoading={isListLoading}
                onThreadClick={setId}
                onStarClick={handleStarClick} 
                activeId={+id || undefined}
                sortBy={sortBy}
                filterBy={userType !== 'client' ? filterBy : undefined}
                isUpdating={isUpdatingSidebar}
                isArchive={true}
            />
            {isChatLoading || isUpdating
            ? (
                <div className="m-auto d-flex">
                    <RiseLoader />
                </div>
            )
            : chatData?.chat_channel && chatData.is_archived && id
            ? (
                <ChatContent 
                    userId={profile.id}
                    chat={chatData}
                    onUpdate={() => refetchChat()}
                    onDeleteChat={handleDeleteChat}
                    isArchive={true}
                    onUnarchive={handleUnarchive}
                />
            )
            : (
                <div className="m-auto d-flex">
                    <p className="light-grey-text">Channel not selected</p>
                </div>
            )
            }
      </div>
      
    </FullScreenModal>
  );
};
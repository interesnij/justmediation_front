import React, { useEffect, useState } from "react";
import { ChatSidebar, ChatHeader, RiseLoader, ChatContent } from "components";
import { sortChatData } from "config";
import { ClientLayout } from "apps/client/layouts";
import { RouteComponentProps, navigate, useParams } from "@reach/router";
import styled from "styled-components";
import { useInput, useChatLists } from "hooks";
import { useAuthContext, useChatContext } from "contexts";
import { useQuery } from "react-query";
import { getChatById, updateChat } from "api";
import { filterChatList } from "helpers";

export const ChatsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const params = useParams();
  const sortBy = useInput(sortChatData[0].id);
  const { profile, userType } = useAuthContext();
  const { resetUnreads } = useChatContext();
  const [isUpdatingSidebar, setUpdatingSidebar] = useState(false)
  const { isListLoading, threadData, setThreadData, forceRefetchLists } = useChatLists();
  const [chatLists, setChatLists] = useState<any[]>([])
  const [currentChat, setCurrentChat] = useState<any>(null)

  useEffect(() => {
    if (isListLoading) return;
    setChatLists(
      filterChatList(threadData, false, sortBy.value)
    )
  }, [sortBy.value, threadData]);

  const { 
    data: chatData, 
    isFetching: isChatLoading, 
    refetch: refetchChat 
  } = useQuery<any, Error>(
    [`clients-chat-${params.id}`, params.id],
    () => getChatById(+(params.id ?? -1)),
    {
      keepPreviousData: true,
      enabled: !!params.id,
    }
  );
    
  useEffect(() => {
    if (chatData)
      setCurrentChat(chatData)
  }, [chatData])

  useEffect(() => {
    if (!params.id) return; 
    refetchChat();
  }, [params.id]);
    
  useEffect(() => {
    if (!currentChat?.chat_channel) return;
    resetUnreads(currentChat.chat_channel);
  }, [currentChat?.chat_channel])

  const handleCreate = (link: string) => {
    forceRefetchLists();
    navigate(link);
  };
  
  const handleStarClick = async (id: number, isFavorite: boolean, isGroup: boolean) => {
    setUpdatingSidebar(true)
    const {data, status} = await updateChat(id, {is_favorite: !isFavorite})
    if (status === 200) {
      setThreadData(
        threadData.map(thread => {
          if (thread?.id === id && thread.is_group === isGroup)
            thread.is_favorite = !isFavorite;
          return thread;
        })
      )    
      // update current chat
      if (currentChat?.id === id) {
        setCurrentChat(data);
      }
    }
    setUpdatingSidebar(false)
  }

  const handleDeleteChat = async () => {
    forceRefetchLists();
    navigate(`/client/chats`);
  }

  const handleArchive = async () => {
    setUpdatingSidebar(true)
    await updateChat(currentChat?.id, {is_archived: true})
    forceRefetchLists();
    setUpdatingSidebar(false)
    navigate(`/${userType}/chats`);
  }

  return (
    <ClientLayout title="Chats">
      <div className="d-flex">
        <Header />
        <ChatHeader
          className="ml-auto"
          onCreate={handleCreate}
          chatLists={chatLists.filter(item => item?.is_archived)}
          isListLoading={isListLoading}
          forceRefetchLists={forceRefetchLists}
        />
      </div>
      <div className="chat-page__main">
        <ChatSidebar
          data={chatLists.filter(item => !item?.is_archived)}
          isLoading={isListLoading}
          onThreadClick={id => navigate(`/client/chats/${id}`)}
          onStarClick={handleStarClick} 
          activeId={params.id}
          sortBy={sortBy}
          isUpdating={isUpdatingSidebar}
        />
        {isChatLoading 
          ? (
            <div className="m-auto d-flex">
              <RiseLoader />
            </div>
          )
          : currentChat?.chat_channel
          ? (
            <ChatContent 
              userId={profile.id}
              chat={currentChat}
              onUpdate={updatedChat => setCurrentChat(updatedChat)}
              onDeleteChat={handleDeleteChat}
              onArchive={handleArchive}
              onCreate={handleCreate}
            />
          )
          : (
            <div className="m-auto d-flex">
              <p className="light-grey-text">Channel not selected</p>
            </div>
          )
        }
      </div>
    </ClientLayout>
  );
};

const Header = styled.div`
  height: 60px;
  border-bottom: 2px solid #eee;
  flex: 1;
`;

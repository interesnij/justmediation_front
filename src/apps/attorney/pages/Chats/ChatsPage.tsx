import React, { useEffect, useState } from "react";
import { getChatTabs, sortChatData } from "config";
import { ChatSidebar, Tab, ChatHeader, RiseLoader, ChatContent, OverlaySpinner } from "components";
import { ChatLayout } from "apps/attorney/layouts";
import { RouteComponentProps, useParams, useLocation, navigate } from "@reach/router";
import { useInput, useChatLists } from "hooks";
import { useQuery } from "react-query";
import { useAuthContext, useChatContext } from "contexts";
import { parse } from "query-string";
import { filterChatList, updateUnreads } from "helpers";
import { 
  getChatById, 
  updateChat,
  createBusinessLeads,
  addContact,
  deleteOpportunity,
  updateUserTypeClientLead
} from "api";

/**
 * ChatsPage
 * 
 */
export const ChatsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const params = useParams();
  const location = useLocation();
  const currentTab = useInput(params.tab);
  const { profile, userType, userId } = useAuthContext();
  const { resetUnreads } = useChatContext();
  const sortBy = useInput(sortChatData[0].id);
  const [isUpdatingSidebar, setUpdatingSidebar] = useState(false)
  const {isListLoading, threadData, setThreadData, forceRefetchLists} = useChatLists();
  const [tabData, setTabData] = useState(getChatTabs(userType));
  const [chatLists, setChatLists] = useState<any[]>([])
  const [transitionMenu, setTransitionMenu] = useState<any[]>([])
  const [currentChat, setCurrentChat] = useState<any>(null)
  const [isOverlaySpinner, setOverlaySpinner] = useState(false);

  const initChatId = () => {
    const newId: any = parse(location.search)?.id;
    return +newId || null;
  }
  const [chatId, setChatId] = useState<number|null>(initChatId())

  useEffect(() => {
    setChatId(initChatId());
  }, [location.search])

  const { 
    data: chatData, 
    isFetching: isChatLoading, 
    refetch: refetchChat 
  } = useQuery<any, Error>(
    [`chat-${chatId}`, chatId],
    () => getChatById(+(chatId ?? -1)),
    {
      keepPreviousData: true,
      enabled: !!chatId,
    }
  );

  useEffect(() => {
    if (chatData)
      setCurrentChat(chatData)
  }, [chatData])
  
  useEffect(() => {
    if (!chatId) return; 
    refetchChat();
  }, [chatId]);
  
  useEffect(() => {
    updateChatLists();
  }, [sortBy.value]);

  useEffect(() => {
    updateChatLists();
    setTabData(
      updateUnreads(
        threadData, tabData, chatId, false, resetUnreads
      )
    );
  }, [threadData]);

  useEffect(() => {
    if (!params.tab && !chatId) {
      navigate(`/${userType}/chats/clients`);
    } 
    sortBy.onChange(sortChatData[0].id)
    updateChatLists();
    if (currentChat?.chat_channel)
      updateConversionMenu(currentChat);
    currentTab.onChange(params.tab);
  }, [params.tab]);

  useEffect(() => {
    if (!params.tab && !chatId) {
      navigate(`/${userType}/chats/clients`);
    } 
  }, []);

  const updateChatLists = () => {
    if (!threadData.length || !params.tab) return;
    setChatLists(
      filterChatList(threadData, params.tab, sortBy.value)
    )
  }

  useEffect(() => {
    if (!currentChat?.chat_channel) return;
    // find the right tab when navigated from a notification
    if (!params.tab){
      navigate(`/${userType}/chats/${currentChat?.chat_type}/?id=${chatId}`);
    }
    resetUnreads(currentChat.chat_channel);
    updateConversionMenu(currentChat);
  }, [currentChat?.chat_channel])

  const updateConversionMenu = (chat) => {
    if (params?.tab === 'network') return;
    const list: any[] = [];
    if (params?.tab === 'opportunities') {
      list.push({ title: "Opportunity", id: "opportunities" });
    } 
    if (params?.tab !== 'clients') {
      list.push({ title: "Lead", id: "leads" });
    }
    list.push({ title: "Client", id: "clients" });
    setTransitionMenu(list);
  }

  const handleConvertToLeads = async (clientId: number, opportunityId: number) => {
    // create lead object 
    await createBusinessLeads({ client: clientId, attorney: profile.id })
    // create contact 
    await addContact(userType, profile.role, userId, clientId);
    // delete opportunity object 
    await deleteOpportunity(opportunityId);
  }

  const handleConversion = async (type: "leads" | "clients") => {
    setOverlaySpinner(true);
    if (
      !currentChat?.participants_data?.length ||
      ["leads", "clients"].indexOf(type) === -1
    ) {
      setOverlaySpinner(false)
      return;
    }
    const separationField = params?.tab === 'opportunities' 
      ? 'opportunity_id'
      : 'lead_id';
    const client = currentChat.participants_data.find(p => p[separationField]) || 
    currentChat.participants_data.find(p => p.user_type === 'client'); // backup
    if (!client) {
      setOverlaySpinner(false)
      return;
    }
    switch (type) {
      case 'leads': 
        await handleConvertToLeads(client.id, client[separationField]);
        break;
      case 'clients': 
        if (params?.tab === 'opportunities' ) {
          await handleConvertToLeads(client.id, client[separationField]);
        }
        await updateUserTypeClientLead(profile.id, client.id);
        break;
      default:
    }
    forceRefetchLists();
    currentTab.onChange(type);
    setOverlaySpinner(false);
    navigate(`/${userType}/chats/${type}?id=${chatId}`);
  }

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

  const handleCreate = (link: string) => {
    forceRefetchLists();
    navigate(link);
  };

  const handleDeleteChat = async () => {
    forceRefetchLists();
    navigate(`/${userType}/chats/${params.tab}`);
  }

  const handleArchive = async () => {
    setUpdatingSidebar(true)
    await updateChat(currentChat?.id, {is_archived: true})
    forceRefetchLists();
    setUpdatingSidebar(false)
    navigate(`/${userType}/chats/${params.tab}`);
  }

  return (
    <ChatLayout userType={userType}>
      <OverlaySpinner isLoading={isOverlaySpinner} />
      <div className="d-flex">
        <Tab data={tabData} {...currentTab} />
        <ChatHeader 
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
          onThreadClick={id => navigate(`/${userType}/chats/${params.tab}?id=${id}`)}
          onStarClick={handleStarClick} 
          activeId={chatId ? +chatId : undefined}
          sortBy={sortBy}
          isUpdating={isUpdatingSidebar}
        />
        {isChatLoading
          ? (
            <div className="m-auto d-flex">
              <RiseLoader />
            </div>
          )
          : chatId && currentChat?.chat_channel && !currentChat.is_archived
          ? (
            <ChatContent 
              userId={profile.id}
              chat={currentChat}
              onUpdate={updatedChat => setCurrentChat(updatedChat)}
              onDeleteChat={handleDeleteChat}
              onArchive={handleArchive}
              onCreate={handleCreate}
              chatType={params.tab}
              typeData={transitionMenu}
              onTypeSelect={handleConversion} 
              onStarClick={handleStarClick}
            />
          )
          : (
            <div className="m-auto d-flex">
              <p className="light-grey-text">Channel not selected</p>
            </div>
          )
        }
      </div>
    </ChatLayout>
  );
};

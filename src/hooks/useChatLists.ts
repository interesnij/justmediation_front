import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useChatContext } from "contexts";
import { getChats } from "api";

export const useChatLists = () => {
  const [threadData, setThreadData] = useState<any[]>([]);
  const { chatThreads } = useChatContext();
  // fetch chats
  const { 
    data: listData, 
    refetch: refetchList, 
    isLoading: isListLoading 
  } = useQuery<{ results: any[]; count: number }, Error>(
    ['all-chats-list'],
    () => getChats(),
    { keepPreviousData: true }
  );

  useEffect(() => {
    updateThreadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData?.results, chatThreads]);

  const getLastMessageTimestamp = (date) => {
    if (!date) return 0;
    const dateString = typeof date === 'string'
      ? date
      : date.toDate();
    return new Date(dateString).getTime();
  }

  const updateThreadData = () => {
    if (!listData?.results) return; 
    setThreadData(
      listData.results.map((item) => {
        const chatThread = chatThreads.find(
          (thread) => thread.NO_ID_FIELD === item.chat_channel
        );
        if (chatThread?.last_chat_message_text)
            item.last_message = {
                type: "text",
                text: chatThread?.last_chat_message_text,
                created: chatThread?.last_chat_message_date
            }
        item.lastMessageTime = getLastMessageTimestamp(chatThread?.last_chat_message_date)
        item.unread = chatThread?.count_unread || 0; 
        return item;
      })
    );
  };

  return {
    isListLoading,
    threadData,
    setThreadData,
    forceRefetchLists: refetchList
  };
};

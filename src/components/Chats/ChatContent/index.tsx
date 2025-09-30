/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import { ChatMessage, ChatSendBox, ChatContentHeader, RiseLoader } from "components";
import { useChatContext, useAuthContext } from "contexts";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { getMessages, sendMessage } from "api";
import { useQuery } from "react-query";

import "./index.scss"
interface Props {
  chat: { 
    id: number;
    title: string;
    chat_channel: string;
    participants_data: any[];
    participants: number[];
    is_group: boolean;
    is_favorite?: boolean;
  };
  userId: number;
  onUpdate?(updatedChat: any): void;
  onSendMessage?(): void;
  onDeleteChat(): void;
  chatMenu?: {
    label: string;
    action: string;
  }[];
  isArchive?: boolean;
  onArchive?(): void;
  onUnarchive?(): void;
  onCreate?(params: string): void;
  chatType?: "network" | "leads" | "opportunities" | "clients";
  onTypeSelect?(type: "leads" | "opportunities" | "clients"): void;
  typeData?: any[];
  onStarClick?(
    id?: number,
    isFavorite?: boolean,
    isGroup?: boolean
  ): void;
}

export const ChatContent = ({ 
  chat,
  onUpdate = () => {}, 
  onDeleteChat = () => {},
  isArchive = false,
  onArchive = () => {}, 
  onUnarchive = () => {}, 
  onCreate = () => {},
  chatType,
  onTypeSelect = () => {},
  typeData = [],
  onStarClick = () => {},
}: Props) => {
  const { newMessageCallback, onStartCall } = useChatContext();
  const { userId } = useAuthContext();
  const messageBottomRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();
  const [lastId, setLastId] = useState(0)
  const [messages, setMessages] = useState<any[]>([]); 

  // set chat document listener
  const chatDocument: any = useFirestoreDocData(
    firestore
      .collection("users").doc(userId || "empty")  
      .collection("chats").doc(chat.chat_channel || "empty")
  ); 
  

  // fetch messages
  const { 
    data, 
    refetch: refetchMessages, 
    isFetching: isMessagesLoading 
  } = useQuery<{ results: any[]; count: number }, Error>(
    [`chat-${chat.id}-messages`],
    () => getMessages(chat.id, {last_id: lastId || null}),
    { enabled: !!chat.id }
  );
  
  useEffect(() => {
    if (!chatDocument.data) return;
    refetchMessages();
  }, [
    chatDocument?.data?.last_chat_message_date, 
    chatDocument?.data?.NO_ID_FIELD
  ]);

  useEffect(() => {
    if (!data?.results?.length) return;
    setLastId(data.results[0]?.id)
    setMessages(
      messages.concat(data.results).filter((obj, i, arr) => 
        arr.map(mapObj => mapObj.id).indexOf(obj.id) === i
      )
    )
  }, [data?.results])

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const handleSendMessage = async (params) => {
    const res = await sendMessage(chat.id, {
      text: params.text,
      files: params.files,
      type: "text"
    })   
    if (res?.data) {
      refetchMessages();
      newMessageCallback(chat, params.text, res.data?.created)
      if (isArchive) onUnarchive();
    }
  };

  const handleSendVoiceMessage = async (params) => {
    const res = await sendMessage(chat.id, params)   
    if (res?.data) {
      refetchMessages();
      newMessageCallback(chat, "Voice message", res.data?.created)
      if (isArchive) onUnarchive();
    } 
  };

  return false ? (
    <div className="m-auto d-flex">
      <RiseLoader />
    </div>
  ) : (
    <div className="chat-content">
      <ChatContentHeader
        data={chat}
        onUpdate={onUpdate}
        onStartCall={onStartCall}
        onDeleteChat={onDeleteChat}
        isArchive={isArchive}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onCreate={onCreate}
        chatType={chatType}
        onTypeSelect={onTypeSelect}
        typeData={typeData}
        onStarClick={() => onStarClick(chat?.id, chat?.is_favorite, chat.is_group)}
      />
      <div className="chat-content__main">
        <div className="chat-content__main-section">
          {!!messages?.length && messages.sort((a,b) => a?.id - b?.id).map((item, index) => (
            <ChatMessage
              key={`${index}key`}
              data={item}
              userInfo={chat.participants_data.find(
                (person) => +person.id === +item?.author
              )}
              participants={chat.participants_data}
            />
          ))}
          <div ref={messageBottomRef} />
        </div>
        <div className="chat-content__main-footer">
          <ChatSendBox
            onSend={handleSendMessage}
            onVoiceSend={handleSendVoiceMessage}
            isArchive={isArchive}
          />
        </div>
      </div>
    </div>
  );
};

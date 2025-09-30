import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";
import { useFirestore, useAuth, useFirestoreCollectionData } from "reactfire";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { useAuthContext } from "contexts";
import { sendMessage } from "api";
import { RiseLoader } from "components";
import "./index.scss";

export interface iCallObject {
  id: string;
  chatId: number;
  chatChannel: string;
  hostId: number;
  startedAt: any;
  participants: number[];
  NO_ID_FIELD: string;
  created: number;
  joinedList: number[];
  key: string;
}
export interface iUpdateCallObject {
  id?: string;
  chatId?: number;
  chatChannel?: string;
  hostId?: number;
  host?: {
    name: string;
    avatar: string;
  }
  startedAt?: any;
  participants?: number[];
  isGroup?: boolean;
  joinedList?: number[];
}
export interface iUpdateChat {
  call?: iUpdateCallObject;
}
export interface ChatContextInterface {
  chatThreads: any[];
  callsList: any[];
  stoppedCalls: any[];
  onStartCall(chat: any, userIds?: number[]): void;
  addStoppedCall(id: number): void;
  resetStoppedCalls(): void;
  updateCall(id: string, data: iUpdateCallObject);
  createCall(id: string, data: iUpdateCallObject): void;
  deleteCall(hostId: string, data: iCallObject): any;
  newMessageCallback(chat: any, text: string, date: string): void;
  resetUnreads(chatChanner: string): void;
}

const initialState: ChatContextInterface = {
  chatThreads: [],
  callsList: [],
  stoppedCalls: [],//localStorage.getItem("stoppedCalls")?.split(',') || [],
  onStartCall: () => {},
  addStoppedCall: () => {},
  resetStoppedCalls: () => {},
  updateCall: () => {},
  createCall: () => {},
  deleteCall: () => {},
  newMessageCallback: () => {},
  resetUnreads: () => {}
};

export const ChatContext = createContext<ChatContextInterface>(
  initialState as ChatContextInterface
);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [value, set] = useLocalstorage("chat-state", initialState);
  const [state, setState] = useState(value);
  const { userId, profile } = useAuthContext();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setLoading] = useState(false);

  /**
   * Start calls list listener 
   * 
   */
  const callsList = useFirestoreCollectionData(
    firestore.collection("calls")
  );

  /**
   * Start user chats list listener 
   * 
   */
  const chatThreads = useFirestoreCollectionData(
    firestore
      .collection("users")
      .doc(userId || "empty")
      .collection("chats")
  );

  /**
   * Send end call message 
   * 
   */
  const sendEndCallMessage = async (data, params) => {
    const res = await sendMessage(data.chatId, {
      text: JSON.stringify({
        participants: params.participants,
        callStartedAt: params.startedAt?.toDate(),
      }),
      type: "endCall"
    })
    newMessageCallback(
      {
        participants: params.participants,
        chat_channel: data.chatChannel
      }, 
      "Call Ended", 
      res.data?.created
    )
  };

  /**
   * Add to ignored/stopped calls 
   * 
   */
  const addStoppedCall = (key: number) => {
    if (
      !state?.stoppedCalls?.length || 
      state.stoppedCalls.indexOf(key) === -1
    ) {
      setState({ ...state, stoppedCalls: state.stoppedCalls.concat(key) });
    }
  }

  /**
   * Reset ignored/stopped calls 
   * 
   */
    const resetStoppedCalls = () => {
      setState({ ...state, stoppedCalls: [] });
    }

  /**
   * Update call record
   * 
   */
  const updateCall = (id: string, data: iUpdateCallObject) => {
    firestore
      .collection("calls")
      .doc(id)
      .update(data);
  }

  /**
   * Create Call record
   * 
   */
  const createCall = (id: string, data: iUpdateCallObject) => {
    const key = uuid();
    localStorage.setItem("callHostKey", key);
    if (data.host && !data.host.avatar)
      data.host.avatar = '';
    firestore
      .collection("calls")
      .doc(id)
      .set({
        ...data,
        id: uuid(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        key: localStorage.getItem("callHostKey")
      });
  }

  /**
   * Delete call record (on disconnect)
   * 
   */
   const deleteCall = async (
    hostId: string, 
    data: iCallObject
   ) => {
    if (data?.chatId)
      await sendEndCallMessage(data, {
        participants: data.joinedList,
        startedAt: data.created,
      })
    // remove record from collection
    firestore
      .collection("calls")
      .doc(hostId)
      .delete();
  }

  /**
   * On Start Call
   * 
   */
  const onStartCall = async (chat, participants) => {
    const currentCall: any = callsList?.data.find(c => c.hostId == userId);
    const btn = document.querySelector<HTMLElement>('.vxt-modal-close-btn > .icon-close');
    if (currentCall && btn) {
      btn.click();
    }
    else {
      setLoading(true);
      // call from unfinished session 
      if (currentCall) {
        await deleteCall(''+currentCall.hostId, currentCall);
        // start call with delay
        setTimeout(() => {  
          handleStartCall(chat, participants)
        }, 5000);
        return;
      }
      // start call
      handleStartCall(chat, participants)
    }
  }

  /**
   * Start Call
   * 
   */
  const handleStartCall = (chat, participants) => {
    setLoading(false);
    const list = participants?.length
    ? [+userId].concat(participants)
    : chat.participants;
    createCall(''+userId, {
      hostId: +userId,
      host: {
        name: profile?.first_name + ' ' + profile?.last_name,
        avatar: profile?.avatar 
      },
      participants: list,
      joinedList: [+userId],
      chatId: chat?.id || null,
      chatChannel: chat?.chat_channel || null,
      isGroup: participants?.length ? true : !!chat?.is_group
    })
  }  

  /**
   * New message callback 
   * 
   */
  const newMessageCallback = (
    chat: { participants, chat_channel }, 
    text: string, 
    date: string
  ) => {
    for(const pid of chat.participants) {
      const payload:any = {
        last_chat_message_text: text,
        last_chat_message_date: date,
      };
      if (Number(userId) !== pid)
        payload.count_unread = firebase.firestore.FieldValue.increment(1)
      firestore
        .collection("users")
        .doc(String(pid))
        .collection("chats")
        .doc(chat.chat_channel)
        .update(payload);
    }
  }

  /**
   * Reset unread count 
   * 
   */
  const resetUnreads = (chatChannel: string) => {
    firestore
      .collection("users")
      .doc(userId)
      .collection("chats")
      .doc(chatChannel)
      .update({ count_unread: 0 });
  }

  /**
   * State onload 
   * 
   */
  useEffect(() => {
    if (value) return; 
    setState({ 
      stoppedCalls: []
    }) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * State update 
   * 
   */
  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  return (
    <>
    {isLoading && (
      <div className="chat-loader">
        <div>
          <p>Closing existing session...</p>
          <RiseLoader/>
        </div>
      </div>
    )}
    <ChatContext.Provider
      value={{
        ...state,
        stoppedCalls: state?.stoppedCalls || [],
        chatThreads: chatThreads?.data || [],
        callsList: callsList?.data || [],
        onStartCall,
        updateCall,
        createCall,
        deleteCall,
        addStoppedCall,
        resetStoppedCalls,
        newMessageCallback,
        resetUnreads
      }}
    >
      {children}
    </ChatContext.Provider>
    </>
  );
};

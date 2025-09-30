
import React, { useEffect, useState } from "react";
import { FolderItem, Button, RiseLoader } from "components";
import { ChatItem } from "./ChatItem";
import { navigate } from "@reach/router";

interface Props {
  type: string, 
  userType: string,
  isLoading, 
  isError, 
  error,
  chatLists: any[],
  tabData: any[]
}

export const ChatSection = ({
  type, 
  userType,
  isLoading, 
  isError, 
  error,
  chatLists = [],
  tabData
}: Props) => {
    const types = type === 'opportunities' ? [type] : ['clients', 'leads'];
    const [items, setItems] = useState<any[]>([])
    const [unreads, setUnreads] = useState<number>(0)

    useEffect(() => {
      setItems(
        chatLists
        .filter((item: any) => 
          types.indexOf(item?.chat_type) !== -1 && 
          item?.last_message?.text && 
          item?.is_group === false && 
          item?.is_archived === false
        )
        .sort((a,b) => b?.unread - a?.unread)
      )
    }, [chatLists])
  
    useEffect(() => {
      setUnreads(
        type === 'opportunities' 
          ? tabData[0].badge
          : tabData[1].badge + tabData[2].badge
      )
    }, [tabData, chatLists])

    return (
      <FolderItem>
        <div className="chat-title mb-1 d-flex">
          <span className="capitalize">
            {type==='clients' 
              ? 'Leads and clients'
              : 'Opportunities'}
          </span>
          {!!unreads && (
            <span className="chat-title__badge">
              {unreads}
            </span>
          )}
      </div>
  
      {isLoading ? (
        <RiseLoader className="my-4" />
      ) : isError ? (
        <div className="my-3 text-center text-gray">
          {error}
        </div>
      ) : items?.length ? ( 
        <div className="row">
          {items.slice(0,3).map((item, index) => (
            <div 
              key={`${index}key`} 
              className="col-md-4 cursor-pointer"
              onClick={() => navigate(`/${userType}/chats/${item?.chat_type}?id=${item?.id}`)}
            >
              <ChatItem data={item} />
            </div>
          ))}
        </div>
      ) : type === 'clients' ? (
        <div className="d-flex flex-column">
          <div className="text-center">
            You currently have no chat messages
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button
              onClick={() => navigate(`/${userType}/chats/leads`)}
              type="outline"
            >
              Start a new chat now!
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column">
          <div className="text-center">
            Find your next opportunity in Potential Engagements
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button onClick={() => navigate(`/${userType}/engagement`)}>
              Browse Potential Engagements
            </Button>
          </div>
        </div>
      )}
    </FolderItem>
    )
  }
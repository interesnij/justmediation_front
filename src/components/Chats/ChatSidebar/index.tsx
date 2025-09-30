import React from "react";
import classNames from "classnames";
import { Select, RiseLoader, ChatThread } from "components";
import { sortChatData } from "config";
import "./style.scss";
interface Props {
  className?: string;
  data?: any[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onThreadClick?(params: number): void;
  onStarClick?(
    id?: number,
    isFavorite?: boolean,
    isGroup?: boolean
  ): void;
  activeId?: number;
  sortBy: {
    value: any;
    onChange: any;
  }
  filterBy?: {
    value: any;
    onChange: any;
  }
  isArchive?: boolean;
}

export const filterChatData = [
  { title: "Opportunities", id: "opportunities" },
  { title: "Leads", id: "leads" },
  { title: "Clients", id: "clients" },
  { title: "Network", id: "network" },
];

export const ChatSidebar = ({
  className,
  data = [],
  isLoading = true,
  isUpdating = false,
  onThreadClick = () => {},
  onStarClick = () => {},
  activeId,
  sortBy,
  filterBy,
  isArchive = false
}: Props) => {
  return (
    <div className={classNames("chat-sidebar", className)}>
      <div className="chat-sidebar__top">
        {isArchive && filterBy ? (
          <Select data={filterChatData} {...filterBy} />
        ) : (
          <span className="my-auto">Sort by</span>
        )}
        <Select data={sortChatData} {...sortBy} />
      </div>
      <div className="chat-sidebar__content d-flex flex-column">
        {isLoading || isUpdating ? (
          <div className="m-auto d-flex">
            <RiseLoader />
          </div>
        ) : (
          data.map((item, index) => {
            return (
              <ChatThread
                {...item}
                key={`${isArchive && 'archive-'}${index}key`}
                active={+(activeId ?? -1) === +item?.id}
                onClick={() => onThreadClick(item?.id)}
                onStarClick={() => onStarClick(item?.id, item?.is_favorite, item.is_group)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

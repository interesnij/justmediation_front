import React, {FC} from "react";
import {FaReply} from "react-icons/fa";
import {User} from "../User";
import {getUserName} from "helpers";
import {format} from "date-fns";

interface IProps {
  expandMessageDisabled: boolean,
  currentUserMessage: boolean,
  handleOpen:() => void;
  data: any;
  userType: string;
}
export const MessagePreview: FC<IProps> =({
                                            expandMessageDisabled,
                                            handleOpen,
                                            currentUserMessage,
                                            data,
                                            userType = ""
                                  }) => {

  const isReadComment: boolean = userType === 'client' ? data?.seen_by_client : data?.seen;

  return (
    <div onClick={handleOpen} className={`message-preview-wrapper ${expandMessageDisabled ? "disabled" : ""}`}>
      <div className="message-preview">
        <div className="message-user-info">
          {
            currentUserMessage ?
              <div className="message-user-avatar">
                <FaReply />
              </div> :
              <User size="normal" avatar={data?.author?.avatar}/>
          }
          <span className="message-author-name ml-2 d-flex align-items-center">
            {currentUserMessage ? "You" : getUserName(data?.author)}
          </span>
        </div>
        <div className={`message-text--small ${isReadComment ? "" : "text-bold"}`}>
          {data?.text}
        </div>
        <div className="text-gray ml-auto my-auto">
          {data?.created
            ? format(new Date(data?.created), "MM/dd/yyyy hh:mm:ss a")
            : ""}
        </div>
      </div>
    </div>
  )
}
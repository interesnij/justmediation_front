import React, {useContext, useState, useMemo, useEffect, useCallback} from "react";
import {User, Attachment, Dropdown} from "components";
import {format} from "date-fns";
import {getUserName} from "helpers";
import {AuthContext} from "contexts";
import {FaReply} from "react-icons/fa";
import {
  deleteMatterMessageComment,
  markCommentRead,
  markCommentUnread,
} from "api";
import ActionIcon from "assets/icons/action_gray.svg";
import {MessagePreview} from "./MessagePreview";
import {MessageButtonGroup} from "./MessageButtonGroup";
import {MessageEditorForm} from "./MessageEditorForm";
import {IPropsMessage} from './interfaces';
import './style.scss';


export const Message = ({
  refetchMessages,
  className,
  data, // comment data
  message, // message input handler
  postParticipants,
  postParticipantsData,
  expandMessageDisabled = false,
  postData, // post data,
  isLastItem = false
}: IPropsMessage) => {
  const {userId, userType} = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(isLastItem);
  const [participants, setParticipants] = useState<number[]>([]);
  const [showMessageEditor, setShowMessageEditor] = useState<boolean>(false);
  const [participantsReplyName, setParticipantsReplyName] = useState<string>("");
  const postIsRead: boolean = userType === 'client' ? data.seen_by_client : data.seen;
  const currentUserMessage: boolean = userId.toString() === data.author.id.toString();
  const hasTwoParticipants: boolean = postData?.participants?.length === 2;

  useEffect(() => {
    // function change status for last comment
    //
    isLastItem && !postIsRead && toMarkCommentRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(data && !postIsRead && postData?.comment_count === 1) {
      markCommentRead(data!.id).then(() => refetchMessages());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, postIsRead, postData?.comment_count]);

  function toParsedReplyName(replyTo: any[], key: {first_name: string, last_name: string}) {
    return [...replyTo, `${replyTo.length > 0 ? ", " : ""} ${key.first_name} ${key.last_name}`]
  }

  useEffect(() => {
    let replyTo: string[] = [];
    if (postParticipants && participants.length > 1 && postParticipantsData) {
      postParticipantsData.forEach((key) => {
        replyTo =  toParsedReplyName(replyTo, key);
      })
    } else {
      replyTo = [`${data.author.first_name} ${data.author.last_name}`]
    }
    setParticipantsReplyName(replyTo.join(""))
  }, [participantsReplyName, postParticipantsData, postParticipants, participants, data, userId]);

  const repliedMessage = useMemo(() => {
    let replyTo: string[] = [];
    data.participants_data.forEach((key) => {
      if (Number(key.id) === Number(userId) && Number(key.id)) {
        return;
      }
      if (Number(key.id) === Number(data.author.id)) return replyTo;
      replyTo = toParsedReplyName(replyTo, key);
    })
    return replyTo.join("");
  }, [data, userId]);

  const handleOpenReply = (participants, showMessage: boolean) => {
    setParticipants(participants);
    setShowMessageEditor(showMessage);
  }

  const handleOpen = async () => {
    setIsOpen((prevState) => !prevState);

    if(!postIsRead && !isOpen) {
     await toMarkCommentRead()
    }
  };


  const toMarkCommentRead = async () => {
    await markCommentRead(data!.id);
    await refetchMessages();
  }
  const handleCancel = () => {
    setShowMessageEditor(false);
    setParticipantsReplyName("");
  }

  const rowActions = useCallback(() => {
    return [
      postIsRead ? {
        label: "Mark as Unread",
        action: "unread",
      } : {
        label: "Mark as Read",
        action: "read",
      },
      {
        label: "Delete",
        action: "delete",
      },
    ]
  }, [postIsRead]);

  const handleActionClick = async (type) => {
    switch (type) {
      case "unread":
        isOpen && setIsOpen(false);
        await markCommentUnread(data!.id);
        await refetchMessages();
        break;
      case "read":
        await markCommentRead(data!.id);
        await refetchMessages();
        break;
      case "delete":
        await deleteMatterMessageComment(data.id);
        await refetchMessages();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`${className || ""} message`}>
      <div className="message-actions">
        <Dropdown
          data={rowActions()}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="client-matter-message-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {!isOpen ? (
        <MessagePreview
          currentUserMessage={currentUserMessage}
          expandMessageDisabled={expandMessageDisabled}
          userType={userType}
          data={data}
          handleOpen={handleOpen}
        />
      ) : (
        <div>
          <div className="d-flex">
            {
              currentUserMessage ?
                <div className="message-user-avatar">
                  <FaReply/>
                </div> :
                <User size="normal" avatar={data?.author?.avatar}/>
            }
            <div className="ml-2 flex-1">
              <div className="d-flex flex-1 cursor-pointer" onClick={handleOpen}>
                <div>
                  {currentUserMessage ?
                    <>
                      <div className="message-author-name mb-1">You</div>
                      <div className="message-reply">
                        to {repliedMessage}
                      </div>
                    </>
                    :
                    <>
                      <div className="message-author-name mb-1">{getUserName(data?.author)}</div>
                      <div className="message-reply">
                        to {repliedMessage}
                      </div>
                    </>
                  }
                </div>
                <span className="text-gray ml-auto my-auto">
                  {data?.created
                    ? format(new Date(data?.created), "MM/dd/yyyy hh:mm:ss a")
                    : ""}
                </span>
              </div>
              <div className="message-text--full mb-4">{data?.text}</div>
              {data?.attachments_data?.length > 0 &&
              <div>
                  <div className="mt-4 mb-1 text-black text-bold">Attachments</div>
                  <div className="mb-2 d-flex flex-wrap">
                    {data.attachments_data.map((key, index) => {
                      return <Attachment
                                key={index}
                                name={key?.file_name || `doc_${index}`}
                                size={key?.file_size || "0KB"}
                                className="message-attachment"
                                url={key?.file}
                      />
                    })}
                  </div>
              </div>
              }
              {!showMessageEditor &&
                  <MessageButtonGroup
                      id={data.author.id}
                      postParticipants={postParticipants}
                      hasTwoParticipants={hasTwoParticipants}
                      handleOpenReply={handleOpenReply}
                  />
              }
              <div className={showMessageEditor ? 'message-editor-open' : 'message-editor-hide'}>
                <MessageEditorForm
                  refetchMessages={refetchMessages}
                  participants={participants}
                  setParticipants={setParticipants}
                  message={message}
                  setShowMessageEditor={setShowMessageEditor}
                  participantsReplyName={participantsReplyName}
                  handleCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

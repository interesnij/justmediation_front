import React, {useState, useEffect} from "react";
import { Dropdown, MultiUsers, Alert, Select } from "components";
import { useModal, useInput } from "hooks";
import {
  GroupDetailModal,
  LeaveGroupModal,
  ArchiveConfirmationModal,
  DeleteChatModal,
  NewMatterModal,
  CallParticipantsModal,
  CallStartModal,
  DirectChatDetailModal,
  NewChatModal,
} from "modals";
import { navigate } from "@reach/router";
import { useAuthContext } from "contexts";
import CallIcon from "assets/icons/call.svg";
import ActionsIcon from "assets/icons/actions.svg";
import FavoriteIcon from "assets/icons/star_fill.svg";
import UnFavoriteIcon from "assets/icons/star_empty.svg";
import { FaBoxOpen, FaTrash } from "react-icons/fa";

interface Props {
  data: any;
  isLoading?: boolean;
  onUpdate?(updatedChat: any): void;
  onStartCall?(chat, userIds?: number[]): void;
  onDeleteChat(): void;
  isArchive?: boolean;
  onUnarchive?(): void;
  onArchive?(): void;
  onCreate?(params: string): void;
  chatType?: "network" | "leads" | "opportunities" | "clients";
  onTypeSelect?(type: "leads" | "opportunities" | "clients"): void;
  typeData?: any[];
  onStarClick?(): void;
}

export const ChatContentHeader = ({
  data,
  onUpdate = () => {},
  onStartCall = () => {},
  onDeleteChat = () => {},
  isArchive = false,
  onUnarchive = () => {},
  onArchive = () => {},
  onCreate = () => {},
  chatType,
  onTypeSelect = () => {},
  typeData = [],
  onStarClick = () => {}
}: Props) => {
  const deleteModal = useModal();
  const archiveModal = useModal();
  const attentionModal = useModal();
  const leaveModal = useModal();
  const groupModal = useModal();
  const directChatModal = useModal();
  const newMatterModal = useModal();
  const callParticipants = useModal();
  const callStartModal = useModal();
  const addParticipantsModal = useModal();
  const { userId, userType, profile } = useAuthContext();
  const [action, setAction] = useState("");
  const [chatMenu, setChatMenu] = useState<any[]>([]);
  const opponentType = useInput(chatType);

  useEffect(() => {
    opponentType.onChange(chatType);
  }, [chatType])

  useEffect(() => {
    if (!data.id) return;
    getChatMenu(data);
  }, [data?.id]);

  const getChatMenu = (chat) => {
    const list: any[] = [];
    chat?.is_group 
      ? (list.push({ label: "Add people",   action: "add" }))
      : (list.push({ label: "Create group", action: "group" }))
      
    if (userType && ['client', 'paralegal', 'other'].indexOf(userType) === -1)
      list.push({ label: "Create a matter", action: "matter" });

    list.push(...[
      {
        label: "Details",
        action: "details",
      },
      {
        label: "Archive",
        action: "archive",
      }
    ])
    chat?.is_group 
      ? (list.push({ label: "Leave",   action: "leave" }))
      : (list.push({ label: "Delete",  action: "delete" }))
    setChatMenu(list);
  }

  const handleAction = (value: string) => {
    setAction(value);
    switch (value) {
      case "add":
      case "group":
        addParticipantsModal.setOpen(true);
        break;
      case "leave":
        leaveModal.setOpen(true);
        break;
      case "delete":
        data?.is_group 
          ? leaveModal.setOpen(true)
          : deleteModal.setOpen(true);
        break;
      case "archive":
        archiveModal.setOpen(true);
        break;
      case "details":
        data?.is_group
          ? groupModal.setOpen(true)
          : directChatModal.setOpen(true);
        break;
      case "matter":
        newMatterModal.setOpen(true);
        break;
      default:
        break;
    }
  };

  const handleGroupClick = () => {
    groupModal.setOpen(true);
  };

  const handleCall = () => {
    data?.participants_data?.length && data.participants_data.length > 2
      ? callParticipants.setOpen(true)
      : callStartModal.setOpen(true);
  }

  const participants = data?.participants_data
    .filter((item) => +item.id !== +userId);

  return (
    <div className="chat-content__top">
      <div className="d-flex my-auto">
        <div style={{ maxWidth: 500 }} className="mr-1 text-ellipsis">
          {data?.title ||
            participants
              .map(
                (item) =>
                  `${item.first_name ?? ""} ${item.middle_name ?? ""} ${
                    item.last_name ?? ""
                  }`
              )
              .join(", ")}
        </div>
        <img 
          className="cursor-pointer"
          onClick={() => onStarClick()}
          src={data?.is_favorite ? FavoriteIcon : UnFavoriteIcon} 
          alt="star" 
        />
      </div>
      <div className="d-flex">
        {!isArchive && 
          userType !== 'client' && 
          data?.participants_data?.length &&
          data?.is_group ? (
            <MultiUsers
              className="overlapping-avatars row-reverse"
              userType={userType}
              data={data?.participants_data
                .filter((item) => +item.id !== +userId)}
            />
          ) : null}
        {!isArchive && chatType && chatType !== 'network' && (
          <Select 
            {...opponentType}
            data={typeData} 
            className="align-items-center ml-2"
            onSelect={onTypeSelect}
          />
        )}
        <div className="ml-3 my-auto cursor-pointer">
          <img 
           src={CallIcon} 
           alt="call" 
           data-tip="Start a Call"
           onClick={handleCall} 
          />
        </div>
        {chatMenu?.length && ( 
          <Dropdown
            data={chatMenu}
            onActionClick={handleAction}
            className="ml-3 mr-3"
          >
            <img src={ActionsIcon} alt="actions" className="my-auto" />
          </Dropdown>
        )}
        {isArchive && (
          <>
            <div 
              title="Unarchive Chat"
              onClick={onUnarchive}
              className="ml-3 my-auto cursor-pointer icon-24"
            >
              <FaBoxOpen />
            </div>
            <div
              title="Remove Chat"
              onClick={e => deleteModal.setOpen(true)} 
              className="mx-3 my-auto cursor-pointer icon-24">
              <FaTrash />
            </div>
          </>
        )}
      </div>
      {
        deleteModal?.open &&
        <DeleteChatModal {...deleteModal} onDelete={onDeleteChat} groupId={data?.id} />
      }
      {
        leaveModal?.open &&
        <LeaveGroupModal {...leaveModal} onLeaveGroup={onDeleteChat} groupId={data?.id} />
      }
      {
        archiveModal?.open &&
        <ArchiveConfirmationModal {...archiveModal} onArchive={onArchive}  />
      }
      {
        attentionModal?.open &&
        <Alert {...attentionModal} type="confirm" title="Attention">
          There's a matter or document tagged with this contact. This contact
          can't be deleted.
        </Alert>
      }
      {
        groupModal?.open &&
        <GroupDetailModal {...groupModal} data={data} onRenameGroup={onUpdate} />
      }
      {
        directChatModal?.open &&
        <DirectChatDetailModal {...directChatModal} data={data} />
      }
      {
        newMatterModal?.open &&
        <NewMatterModal {...newMatterModal} onCreate={() => navigate(`/${userType}/chats/clients`)} />
      }
      {
        callParticipants?.open &&
        <CallParticipantsModal {...callParticipants} allParticipants={participants} onCreate={userIds => onStartCall(data, userIds)} />
      }
      <CallStartModal 
        {...callStartModal} 
        onConfirm={() => onStartCall(data)} 
        participants={data?.participants_data} 
        userId={profile?.id} 
      />
      {
        data?.participants?.length && 
        <NewChatModal {...addParticipantsModal} chatId={action === 'add' ? data.id : undefined} onCreate={onCreate} initialValue={data.participants.filter(id => id !== +userId)} />
      }
    </div>
  );
};

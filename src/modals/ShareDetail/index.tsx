import React, { useState } from "react";
import { SideModal, User, Button } from "components";
import { useModal } from "hooks";
import { createChat } from "api";
import { useAuthContext, useChatContext } from "contexts";
import { CallStartModal } from "modals";
import styled from "styled-components";
import "./style.scss";
import { navigate } from "@reach/router";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  data: any;
}
export const ShareDetailModal = ({
  open,
  setOpen,
  data,
}: Props) => {

  const [users, setUsers] = useState(data);
  const callStartModal = useModal();
  const { onStartCall } = useChatContext();
  const { userId } = useAuthContext();
  const [participants, setParticipants] = useState<[any?]>([]);

  const handleViewProfile = (info) => {
    if (info && info.user_type) {
      navigate(`/client/find/${info.user_type}s/${info.id}`);
    }
  }

  const handleChat = async (index) => {
    const Users = [...users];
    Users[index].isCreatingChat = true;
    setUsers(Users);
    const chatObject = await createChat({
      participants: [users[index].id],
      is_group: 0
    });
    navigate(`/client/chats/${chatObject.id}`);
  }

  const handleCall = (index) => {
    callStartModal.setOpen(true);
    const Users = [...users];
    Users.forEach(item => item.user_id = item.id);
    setUsers(Users);
    setParticipants([Users[index]]);
  }

  return (
    <>
      <SideModal size="small" title="Shared With" open={open} setOpen={setOpen}>
        <div className="d-flex mt-3">
          <Heading>Members</Heading>
          <span className="ml-1 my-auto text-gray">
            {users?.length ? users.length : 0}
          </span>
        </div>
        <div className="mt-3 shared-users">
          {
            users.map((item, index) => (
              <div key={`${index}key`}>
                <div className="my-1">
                  <User
                    userName={`${item.first_name ?? ""} ${item.middle_name ?? ""} ${item.last_name ?? ""
                      }`}
                    avatar={item.avatar}
                    tagName={item?.user_type}
                  />
                  <div className="mt-2 d-flex btn-container">
                    <Button type="outline" className="mr-2" onClick={() => handleViewProfile(item)}>View Profile</Button>
                    <Button type="outline" className="mr-2" isLoading={item.isCreatingChat} onClick={() => handleChat(index)}>Chat</Button>
                    <Button type="outline" onClick={() => handleCall(index)}>Call</Button>
                  </div>
                </div>
                <div className="divider my-2"></div>
              </div>
            ))
          }
        </div>
      </SideModal>
      <CallStartModal
        {...callStartModal}
        onConfirm={() => {
          onStartCall({ participants: [+userId, participants[0].id] });
          setOpen(false);
        }}
        participants={participants}
        userId={+userId}
      />
    </>
  );
};

const Heading = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #2e2e2e;
`;

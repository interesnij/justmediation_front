/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { SideModal, User, InputEdit, Button, ChatThreadAvatar } from "components";
import { useInput, useModal } from "hooks";
import { LeaveGroupModal } from "modals";
import styled from "styled-components";
import { updateChat } from "api";
import "./style.scss"

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  data: any;
  onRenameGroup?(updatedChat: any): void;
}
export const GroupDetailModal = ({
  open,
  setOpen,
  data,
  onRenameGroup = () => {},
}: Props) => {
  const name = useInput(data?.title);
  const leaveModal = useModal();
  const [isShowAll, showAll] = useState(false);

  useEffect(() => {
    if (open) {
      name.onChange(data?.title);
    }
    return () => {};
  }, [open]);

  const handleTitleChange = async (title: string) => {
    const {status, data: updatedChat} = await updateChat(data.id , { title });
    if (status === 200) {
      onRenameGroup(updatedChat);
    }
  }

  const toggableList = !isShowAll && data?.participants_data.length > 10;

  return (
    <SideModal size="small" title="Detail" open={open} setOpen={setOpen}>
      <div className="d-flex mb-1">
        <Heading>Group Name</Heading>
      </div>
      <InputEdit {...name} className="w-100" renamable={true} onChangeName={handleTitleChange} />

      <div className="divider my-2"></div>
      <div className="d-flex">
        <Heading>Members</Heading>
        <span className="ml-1 my-auto text-gray">
          {data?.participants_data?.length ? data.participants_data.length : 0}
        </span>
      </div>
      <Content>
        {(toggableList ? data?.participants_data.slice(0, 10) : data?.participants_data)
          .map((item, index) => (
            <div className="d-flex my-1" key={`group-i-${index}`}>
              <User
                userName={`${item.first_name ?? ""} ${item.middle_name ?? ""} ${
                  item.last_name ?? ""
                }`}
                avatar={item.avatar}
              />
              <span className="user-type-label ml-auto my-auto">{item?.user_type?.toUpperCase()}</span>
            </div>
          ))}
          {toggableList && (
            <div className="d-flex my-1">
              <div className="align-items-center">
                <div className="mr-1">
                  <ChatThreadAvatar data={data?.participants_data.slice(10,2).map((item) => item.avatar)}/>
                </div>
                +{data?.participants_data.length - 10}
              </div>
              <span className="user-type-label link ml-auto my-auto" onClick={() => showAll(true)}>
                VIEW ALL
              </span>
            </div>
          )}
      </Content>
      <div className="mt-2">
        <Button type="outline">Add People</Button>
      </div>
      <div className="mt-auto d-flex justify-content-center">
        <Button theme="white" onClick={e => leaveModal.setOpen(true)}>
          Leave Group
        </Button>
      </div>
      {
        leaveModal?.open &&
        <LeaveGroupModal {...leaveModal} groupId={data?.id} />
      }
    </SideModal>
  );
};

const Heading = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #2e2e2e;
`;
const Content = styled.div`
  max-height: 480px;
  overflow-y: auto;
`;

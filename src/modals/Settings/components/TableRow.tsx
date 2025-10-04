import React from "react";
import { Dropdown, User, Tag } from "components";
import { navigate } from "@reach/router";
import ActionIcon from "assets/icons/action_gray.svg";
import styled from "styled-components";
import { useModal } from "hooks";
import { DeleteConfirmationModal } from "modals";
import { getUserName } from "helpers";
import { useAuthContext } from "contexts";
import { enterpriseDeleteTeamMember, getCurrentProfile } from "api";

const rowActions = [
  {
    label: "View",
    action: "view",
  },
  {
    label: "Delete",
    action: "delete",
  },
];

export default function TableRow({ member, onDelete = () => {} }) {
  const deleteModal = useModal();
  const { userType, userId, setProfile } = useAuthContext();
  const handleNameClick = () => {
    navigate(`/${userType}/contacts/${member.id}`);
  };
  const handleActionClick = (params: string) => {
    switch (params) {
      case "view":
        handleNameClick();
        break;
      case "delete":
        deleteModal.setOpen(true);
        break;
      default:
        break;
    }
  };
  const updateProfile = async () => {
    const profle = await getCurrentProfile(userType);
    setProfile(profle);
  };
  const handleRemoveTeamMember = async () => {
    const data = member.id
      ? {
        team_members_registered: [member.id],
      }
      : {
        team_members: [
          {
            email: member.email,
          },
        ],
      };
    const res = await enterpriseDeleteTeamMember(userId, data);
    updateProfile();
  };
  const isMe = member?.id == userId;
  return (
    <div className="members-page__table-row">
      <div className="members-page__table-row-item">
        <User avatar={member?.avatar} />
        <Name className="ml-1">
          {getUserName(member) || "Not Registered User"}
        </Name>
        {member?.state === "pending" && <Tag type="pending" className="ml-1" />}
        {isMe && (
          <Tag isCustomContent type="custom" className="ml-1">
            Admin
          </Tag>
        )}
      </div>
      <div className="members-page__table-row-item capitalize">
        <span>
          {isMe || member?.is_mediator === true || member?.type === "mediator"
            ? "Mediator"
            : member?.is_paralegal === true || member?.type === "paralegal"
              ? "Paralegal"
              : "Other"}
        </span>
      </div>
      <div className="members-page__table-row-item">
        <span>{member?.email}</span>
      </div>
      <div className="members-page__table-row-item">
        {!isMe && (
          <Dropdown
            data={rowActions}
            className="mx-auto"
            onActionClick={handleActionClick}
          >
            <img
              src={ActionIcon}
              alt="action"
              className="members-page__table-row-item-action"
            />
          </Dropdown>
        )}
      </div>
      <DeleteConfirmationModal
        {...deleteModal}
        title="Remove team member"
        message="Are you sure you want to remove this team member permanently?"
        onDelete={handleRemoveTeamMember}
      />
    </div>
  );
}

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

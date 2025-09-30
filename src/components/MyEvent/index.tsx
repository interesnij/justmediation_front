import React from "react";
import styled from "styled-components";
import moment from 'moment';
import { NewEventModal, DeleteConfirmationModal } from "modals";
import { useModal } from "hooks";
import EditImg from "assets/icons/edit.svg";
import DeleteImg from "assets/icons/delete_green.svg";
import { deleteEvent } from "api";

interface Props {
  data: any;
  onUpdate?(): void;
}
export const MyEvent = ({ data, onUpdate = () => {} }: Props) => {
  const editModal = useModal();
  const confirmDeleteModal = useModal();

  const handleDeleteConfirm = () => {
    confirmDeleteModal?.setOpen(true);
  }

  const handleDelete = async () => {
    await deleteEvent(data?.id);
    await onUpdate();
  };

  const handleEdit = (params) => {
    editModal.setOpen(true);
  };

  return (
    <Container>
      <div className="d-flex">
        <Title>{data?.title}</Title>
        <IconButton
          src={DeleteImg}
          onClick={handleDeleteConfirm}
          className="ml-auto"
        />
        <IconButton src={EditImg} className="ml-3" onClick={handleEdit} />
      </div>
      <div className="d-flex mt-2">
        <Name>WHEN:</Name>
        <Value>
          {data?.start
            ? moment(data?.start).format("MM/DD/yyyy hh:mm:ss A")
            : ""}
        </Value>
      </div>
      <div className="d-flex mt-1">
        <Name>WHERE:</Name>
        <Value>{data?.location}</Value>
      </div>
      <div className="d-flex mt-1">
        <Name>WHAT:</Name>
        <Value>{data?.description}</Value>
      </div>
      {
        editModal?.open &&
        <NewEventModal
          data={{
            id: data?.id,
            title: data?.title,
            description: data?.description,
            location: data?.location,
            timezone: data?.timezone,
            is_all_day: data?.is_all_day,
            startDate: data?.start
              ? moment(data.start).format("MM/DD/yyyy")
              : "",
            startTime: data?.end ? data.start : new Date(),
            endDate: data?.end ? moment(data.end).format("MM/DD/yyyy") : "",
            endTime: data?.end ? data.end : new Date(),
          }}
          {...editModal}
          onCreate={() => onUpdate()}
        />
      }
      {
        confirmDeleteModal?.open &&
        <DeleteConfirmationModal
          {...confirmDeleteModal}
          title="Delete event"
          message="Are you sure you want to delete this event permanently?"
          onDelete={handleDelete}
        />
      }
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff;
  font-family: var(--font-family-primary);
  padding: 16px;
  border-radius: 0px;
  &:hover {
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
  }
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: -0.01em;

  color: #000000;
`;

const Name = styled.div`
  color: #98989a;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  line-height: 26px;
  width: 100px;
`;
const Value = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  letter-spacing: -0.01em;
  color: #2e2e2e;
`;

const IconButton = styled.img`
  width: 20px;
  transition: all 300ms ease;
  cursor: pointer;
  display: none;
  ${Container}:hover & {
    display: block;
  }
  &:hover {
    opacity: 0.7;
  }
`;

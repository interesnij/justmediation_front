import React, {FC} from "react";
import {
  Button,
  Select,
  MyEvent,
  RiseLoader,
} from "components";
import { NewEventModal } from "modals";
import styled from "styled-components";
import { useInput, useModal } from "hooks";
import { useQuery } from "react-query";
import { getEvents } from "api";
import { useAuthContext } from "contexts";

const sortData = [
  { id: "end", title: "All" },
  { id: "-end", title: "Upcoming" },
];

interface IProps {
  handleCancel?: (arg: boolean) => void;
}

export const MyEvents: FC<IProps> = ({ handleCancel }) => {
  const { profile } = useAuthContext();
  console.log(profile)
  const sortBy = useInput(sortData[0].id);
  const eventModal = useModal();
  const {
    isLoading,
    isError: isEventError,
    error: eventError,
    data: eventData,
    refetch: refetchEvents,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["events", sortBy.value],
    () => getEvents({ [!profile.role || profile.role === "Attorney"?"attorney":"paralegal"]: profile.role?profile.admin_user_data.id: profile.id, ordering: sortBy.value }),
    {
      keepPreviousData: true,
      enabled: !!profile?.id
    }
  );

  const handleNewEvent = () => {
    eventModal.setOpen(true);
  };
  return (
    <div className="d-flex flex-column flex-1 overflow-auto">
      <Header>
        <Select
          data={sortData}
          {...sortBy}
          className="my-auto"
          label="Sort by"
          width={120}
        />
        <Button
          className="ml-auto my-auto"
          onClick={handleNewEvent}
          icon="plus"
        >
          New Event
        </Button>
      </Header>
      <Content>
        {isLoading ? (
          <RiseLoader className="my-4" />
        ) : isEventError ? (
          <div className="my-4 text-center text-gray">{eventError}</div>
        ) : eventData?.results.length === 0 ? (
          <div className="my-4 text-center text-gray">{"No events"}</div>
        ) : (
          eventData?.results.map((event, index) => (
            <div key={`${index}key`}>
              <MyEvent data={event} onUpdate={() => refetchEvents()} />
              <div className="divider my-3"/>
            </div>
          ))
        )}
      </Content>
      {
        eventModal?.open &&
        <NewEventModal {...eventModal} onCreate={() => refetchEvents()} />
      }
    </div>
  );
};
const Header = styled.div`
  height: 72px;
  background: white;
  padding: 0 40px;
  display: flex;
`;

const Content = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 5px 5px 0px 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 40px 40px 0 40px;
  padding: 24px 24px 10px 24px;
`;

import React, {useState} from "react";
import {Select, Pagination, SearchBar, IconButton} from "components";
import {useInput, useModal} from "hooks";
import {useParams} from "@reach/router";
import {NewMessageModal} from "modals";
import {MessagesTable} from "./messagesTable/MessagesTable";
import {getMatterTopics} from "api";
import {useQuery} from "react-query";
import {MATTERS_PER_PAGE} from "config";
import {RiseLoader} from "components";

const filterData = [
  {title: "All", id: ""},
  {title: "Unread", id: "false"},
  {title: "Read", id: "true"}
];

export default function MessagesPage({ matterData, onUpdate = () => {} }) {
  const msgModal = useModal();
  const filterBy = useInput(filterData[0].id);
  const params = useParams();
  const page = useInput(0);
  const search = useInput("");
  const [sorting, setSorting] = useState("");

  const handleNewMessage = () => {
    msgModal.setOpen(true);
  };

  const {isLoading, isError, error, data, refetch} = useQuery<{ results: any[]; count: number },
    Error>(
    ["matter-messages", page.value, search.value, filterBy.value, sorting],
    () =>
      getMatterTopics({
        matter: params.id,
        page: page.value,
        pageSize: MATTERS_PER_PAGE,
        search: search.value,
        seen: filterBy.value,
        ordering: sorting
      }),
    {
      keepPreviousData: true,
    }
  );
  return (
    <div className="flex-1 d-flex flex-column">
      <div className="client-matters-page__top mb-3">
        <div className="row d-flex align-items-center">
          <div className="col-9 d-flex align-items-center">
            <SearchBar
              {...search}
              icon="search"
              placeholder="Search in My Messages"
              className="w-100"
            />
            <Select
              {...filterBy}
              data={filterData}
              label="Filter by"
              className="ml-3"
            />
          </div>
          <div className="col-3 d-flex align-items-center justify-content-end">
            <IconButton
              type="post"
              toolTip="Create a message"
              onClick={handleNewMessage}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 d-flex flex-column">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader/>
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <MessagesTable
              data={data.results}
              onUpdate={() => {
                refetch();
                onUpdate();
              }}
              onSort={setSorting}
            />
            <Pagination
              className="mt-auto"
              tatalCount={data?.count}
              {...page}
            />
          </>
        ) : (
          <>
            <p className="mx-auto my-auto text-center text-gray">
              You currently have no messages.
            </p>
            {/* <Button
              icon="plus"
              onClick={() => {
                msgModal.setOpen(true);
              }}
              className="mx-auto mt-1 mb-auto"
            >
              New message
            </Button> */}
          </>
        )}
      </div>
      {
        msgModal?.open && matterData &&
          <NewMessageModal
            {...msgModal}
            matter={params.id}
            data={matterData}
            onCreate={() => refetch()}
          />
      }
    </div>
  );
}
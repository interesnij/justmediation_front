import React, { useState } from "react";
import {
  Pagination,
  SearchBar,
  IconButton,
  RiseLoader,
  Button,
} from "components";
import { useAuthContext } from "contexts";
import { useModal } from "hooks";
import { NewMatterNoteModal } from "modals";
import { NotesTable } from "./notesTable/NotesTable";
import { useParams } from "@reach/router";
import { useQuery } from "react-query";
import { getMatterNotes } from "api";
import { useInput } from "hooks";
import { MATTERS_PER_PAGE } from "config";

export default function NotesPage() {
  const noteModal = useModal();
  const params = useParams();
  const page = useInput(0);
  const search = useInput("");
  const [sorting, setSorting] = useState("");
  const { userId } = useAuthContext();

  const handleNewModal = () => {
    noteModal.setOpen(true);
  };
  const { isLoading, isError, error, data, refetch } = useQuery<
    { results: any[]; count: number },
    Error
  >(
    ["matter-notes", params.id, page.value, search.value, sorting],
    () =>
      getMatterNotes({
        matter: params.id,
        search: search.value,
        page: page.value,
        pageSize: MATTERS_PER_PAGE,
        ordering: sorting,
        created_by: +userId,
      }),
    {
      keepPreviousData: true,
    }
  );
  return (
    <div className="d-flex flex-column flex-1">
      <div className="client-matters-page__top mb-3">
        <div className="row">
          <div className="col-6">
            <SearchBar
              icon="search"
              placeholder="Search in Notes"
              {...search}
            />
          </div>

          <div className="col-1 ml-auto my-auto d-flex">
            <IconButton
              type="plus"
              toolTip="Create a message"
              className="ml-auto my-auto"
              onClick={handleNewModal}
            />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-1">
        {isLoading ? (
          <div className="my-auto d-flex">
            <RiseLoader />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <NotesTable
              data={data.results}
              onUpdate={() => refetch()}
              onSort={setSorting}
            />
            <Pagination
              className="mt-auto"
              tatalCount={data?.count}
              {...page}
            />
          </>
        ) : (
          <div className="mx-auto my-auto">
            <p className=" text-center text-gray">
              You currently have no notes.
            </p>
            <Button
              icon="plus"
              onClick={() => {
                noteModal.setOpen(true);
              }}
              className="mx-auto mt-1 mb-auto"
            >
              New note
            </Button>
          </div>
        )}
      </div>
      {
        noteModal?.open &&
        <NewMatterNoteModal
          {...noteModal}
          matter={params.id}
          onCreate={() => refetch()}
        />
      }
    </div>
  );
}

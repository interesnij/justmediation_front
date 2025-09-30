import React, { useState } from "react";
import {
  Select,
  Pagination,
  SearchBar,
  DropdownButton,
  RiseLoader,
  DocumentNav,
} from "components";
import { useInput, useModal } from "hooks";
import { DocumentsTable } from "./documentsTable/DocumentsTable";
import { useQuery } from "react-query";
import {
  getDocuments,
  getOnyDocuments,
  getOnyFolders,
  getDocumentImages,
  getDocumentVoices,
  getDocumentByMe,
  getDocumentSharedWithMe,
} from "api";
import { last } from "lodash";
import { NewDocumentFolderModal, NewDocumentModal } from "modals";
import { useParams } from "@reach/router";
import { useAuthContext } from "contexts";
const filterData = [
  {
    title: "All",
    id: "all",
  },
  {
    title: "Folders",
    id: "folders",
  },
  {
    title: "Documents",
    id: "documents",
  },
  {
    title: "Images",
    id: "images",
  },
  {
    title: "Voice messages",
    id: "voice",
  },
  {
    title: "Owned by me",
    id: "owned",
  },
  {
    title: "Shared with me",
    id: "shared",
  },
];

const menuData = [
  {
    title: "Folder",
    id: "folder",
  },
  {
    title: "Document(s) upload",
    id: "document",
  },
];
export default function DocumentsPage({ matterData }) {
  const search = useInput("");
  const page = useInput(0);
  const filter = useInput(filterData[0].id);
  const documentFolderModal = useModal();
  const documentModal = useModal();
  const { userId } = useAuthContext();
  const [sorting, setSorting] = useState("");

  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: "My Documents",
    },
  ]);
  const params = useParams();
  const { isError, error, data, refetch, isFetching, isFetched } = useQuery<
    { results: any[]; overall_total: number },
    Error
  >(
    [
      "client-matter-documents",
      page.value,
      search.value,
      params.id,
      last(folders).id,
      sorting,
      filter.value,
    ],
    () =>
      filter.value === "all"
        ? getDocuments({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
            client: +userId,
            matter: params.id,
          })
        : filter.value === "documents"
        ? getOnyDocuments({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
            client: +userId,
            matter: params.id,
          })
        : filter.value === "folders"
        ? getOnyFolders({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
            client: +userId,
            matter: params.id,
          })
        : filter.value === "images"
        ? getDocumentImages({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
            client: +userId,
            matter: params.id,
          })
        : filter.value === "voice"
        ? getDocumentVoices({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
            client: +userId,
            matter: params.id,
          })
        : filter.value === "owned"
        ? getDocumentByMe(
            {
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              client: +userId,
              matter: params.id,
            },
            userId
          )
        : getDocumentSharedWithMe(
            {
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              client: +userId,
              matter: params.id,
            },
            userId
          ),
    {
      keepPreviousData: true,
    }
  );

  const handleNewClick = (params) => {
    switch (params) {
      case "folder":
        documentFolderModal.setOpen(true);
        break;
      case "document":
        documentModal.setOpen(true);
        break;

      default:
        break;
    }
  };
  return (
    <div className="client-matters-page">
      <div className="client-matters-page__top mb-3">
        <div className="row">
          <div className="col-6">
            <SearchBar
              icon="search"
              placeholder="Search in Documents"
              {...search}
            />
          </div>
          <Select
            data={filterData}
            {...filter}
            label="Filter by"
            className="ml-4 my-auto"
          />
          <DropdownButton
            className="ml-auto"
            menuData={menuData}
            onClick={handleNewClick}
          >
            New
          </DropdownButton>
        </div>
      </div>
      <div className="d-flex flex-column flex-1">
        <DocumentNav folders={folders} onClick={(e) => setFolders(e)} />
        {isFetching && !isFetched ? (
          <div className="my-auto d-flex">
            <RiseLoader className="my-4" />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <DocumentsTable
              data={data.results}
              onFolderClick={(e) => setFolders([...folders, e])}
              onSort={setSorting}
              onUpdate={() => refetch()}
            />
            <Pagination
              className="mt-auto"
              tatalCount={data?.overall_total ?? 0}
              countPerPage={20}
              currentFolderId={last(folders).id}
              {...page}
            />
          </>
        ) : (
          <>
            <p className="mx-auto my-auto text-center my-4 text-gray">
              You currently don't have any documents or folders.
            </p>
          </>
        )}
      </div>
      {matterData && (
        <>
          {
            documentFolderModal?.open &&
            <NewDocumentFolderModal
              {...documentFolderModal}
              parent={last(folders).id}
              matter={params.id}
              client={+userId}
              onCreate={() => refetch()}
              sharedWith={matterData?.shared_with}
              isForClient
            />
          }
          {
            documentModal?.open &&
            <NewDocumentModal
              {...documentModal}
              matter={params.id}
              client={+userId}
              onCreate={() => refetch()}
              isForClient
            />
          }
        </>
      )}
    </div>
  );
}

import React, { useState } from "react";
import {
  Pagination,
  RiseLoader,
  SearchBar,
  Select,
  DropdownButton,
  DocumentNav,
} from "components";
import { useInput, useModal } from "hooks";
import { DocumentsTable } from "./DocumentsTable";
import { useQuery } from "react-query";
import { RouteComponentProps } from "@reach/router";
import {
  getDocuments,
  getOnyDocuments,
  getOnyFolders,
  getDocumentImages,
  getDocumentVoices,
  getDocumentByMe,
  getDocumentSharedWithMe,
} from "api";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import { DocumentsLayout } from "layouts";
import { last } from "lodash";
import {
  NewDocumentFolderModal,
  NewDocumentModal,
  NewDocumentDuplicateModal,
} from "modals";
import "./style.scss";

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
    title: "Voice Messages",
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
  {
    title: "Document from template",
    id: "template",
  },
];

export const MyDocuments: React.FunctionComponent<RouteComponentProps> = () => {
  const search = useInput("");
  const page = useInput(0);
  const filter = useInput(filterData[0].id);
  const documentFolderModal = useModal();
  const documentModal = useModal();
  const duplicateModal = useModal();
  const [sorting, setSorting] = useState("");
  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: "My Documents",
    },
  ]);
  const { userId } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();

  const { isFetching, isFetched, isError, error, data, refetch } = useQuery<
    { results: any[]; overall_total: number },
    Error
  >(
    [
      "documents",
      page.value,
      search.value,
      last(folders).id,
      filter.value,
      sorting,
    ],
    () =>
      filter.value === "all"
        ? getDocuments({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
          })
        : filter.value === "documents"
        ? getOnyDocuments({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
          })
        : filter.value === "folders"
        ? getOnyFolders({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
          })
        : filter.value === "images"
        ? getDocumentImages({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
          })
        : filter.value === "voice"
        ? getDocumentVoices({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            ordering: sorting,
          })
        : filter.value === "owned"
        ? getDocumentByMe(
            {
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
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
      case "template":
        duplicateModal.setOpen(true);
        break;

      default:
        break;
    }
  };

  return (
    <DocumentsLayout tab="Documents">
      <div className="documents-page__bar">
        <div className="documents-page__bar-input">
          <SearchBar
            icon="search"
            placeholder={`Search in My Documents`}
            {...search}
          />
        </div>
        <Select
          label="Filter by"
          className="documents-page__bar-filter"
          data={filterData}
          width={160}
          {...filter}
        />
        {hasSubscription &&
            <DropdownButton
            className="ml-auto"
            menuData={menuData}
            onClick={handleNewClick}
        >
          New
        </DropdownButton>
        }

      </div>
      <div className="my-documents-page__content">
        <DocumentNav folders={folders} onClick={(e) => setFolders(e)} />
        {isFetching && !isFetched ? (
          <div className="my-auto d-flex">
            <RiseLoader />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <DocumentsTable
              data={data.results}
              onFolderClick={(e) => setFolders([...folders, e])}
              onUpdate={() => refetch()}
              onSort={setSorting}
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
            <p className="mx-auto my-auto text-center text-gray">
              You currently don't have any documents or folders.
            </p>
          </>
        )}
      </div>
      {
        documentFolderModal?.open &&
        <NewDocumentFolderModal
          {...documentFolderModal}
          parent={last(folders).id}
          onCreate={() => refetch()}
        />
      }
      {
        documentModal?.open && 
        <NewDocumentModal {...documentModal} onCreate={() => refetch()} />
      }
      {
        duplicateModal.open &&
        <NewDocumentDuplicateModal
          {...duplicateModal}
          parent={last(folders)?.id}
          onCreate={() => refetch()}
        />
      }
    </DocumentsLayout>
  );
};

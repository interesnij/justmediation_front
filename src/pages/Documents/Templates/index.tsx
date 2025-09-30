import React, { useState } from "react";
import {
  Pagination,
  RiseLoader,
  SearchBar,
  Select,
  DropdownButton,
  DocumentNav,
} from "components";
import { DocumentsLayout } from "layouts";
import { RouteComponentProps } from "@reach/router";
import { TemplatesTable } from "./TemplatesTable";
import { useInput, useModal } from "hooks";
import {
  getDocuments,
  getOnyDocuments,
  getOnyFolders,
  getDocumentImages,
  getDocumentVoices,
  getDocumentByMe,
  getDocumentSharedWithMe,
} from "api";
import { useQuery } from "react-query";
import { NewDocumentModal, NewTemplateFolderModal } from "modals";
import { last } from "lodash";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
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
    title: "Template(s) upload",
    id: "template",
  },
];
export const Templates: React.FunctionComponent<RouteComponentProps> = () => {
  const search = useInput("");
  const page = useInput(0);
  const filter = useInput(filterData[0].id);
  const { userId } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: "Templates",
    },
  ]);
  const templateModal = useModal();
  const folderModal = useModal();
  const [sorting, setSorting] = useState("");

  const { isFetching, isFetched, isError, error, data, refetch } = useQuery<
    { results: any[]; overall_total: number },
    Error
  >(
    [
      "templates",
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
          isTemplate: true,
          ordering: sorting,
        })
        : filter.value === "documents"
          ? getOnyDocuments({
            page: page.value,
            search: search.value,
            parent: last(folders)?.id,
            is_parent: last(folders)?.id === undefined,
            isTemplate: true,
            ordering: sorting,
          })
          : filter.value === "folders"
            ? getOnyFolders({
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              isTemplate: true,
              ordering: sorting,
            })
            : filter.value === "images"
              ? getDocumentImages({
                page: page.value,
                search: search.value,
                parent: last(folders)?.id,
                is_parent: last(folders)?.id === undefined,
                isTemplate: true,
                ordering: sorting,
              })
              : filter.value === "voice"
                ? getDocumentVoices({
                  page: page.value,
                  search: search.value,
                  parent: last(folders)?.id,
                  is_parent: last(folders)?.id === undefined,
                  isTemplate: true,
                  ordering: sorting,
                })
                : filter.value === "owned"
                  ? getDocumentByMe(
                    {
                      page: page.value,
                      search: search.value,
                      parent: last(folders)?.id,
                      is_parent: last(folders)?.id === undefined,
                      isTemplate: true,
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
                      isTemplate: true,
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
        folderModal.setOpen(true);
        break;
      case "template":
        templateModal.setOpen(true);
        break;

      default:
        break;
    }
  };

  return (
    <DocumentsLayout tab="Templates">
      <div className="documents-page__bar">
        <div className="documents-page__bar-input">
          <SearchBar
            icon="search"
            placeholder={`Search in My Templates`}
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
        {hasSubscription && <DropdownButton
            className="ml-auto"
            onClick={handleNewClick}
            menuData={menuData}
        >
            New
        </DropdownButton>}
      </div>
      <div className="templates-page__content">
        <DocumentNav folders={folders} onClick={(e) => setFolders(e)} />

        {isFetching && !isFetched ? (
          <div className="my-auto d-flex">
            <RiseLoader />
          </div>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : data?.results && data?.results?.length > 0 ? (
          <>
            <TemplatesTable
              data={data.results}
              onFolderClick={(e) => setFolders([...folders, e])}
              onUpdate={() => refetch()}
              onSort={setSorting}
            />
            <Pagination
              className="mt-auto"
              tatalCount={data?.overall_total}
              currentFolderId={last(folders).id}
              {...page}
            />
          </>
        ) : (
          <>
            <p className="mx-auto my-auto text-center text-gray">
              You currently don't have any templates.
            </p>
          </>
        )}
      </div>
      {
        templateModal?.open &&
        <NewDocumentModal
          {...templateModal}
          isTemplate
          onCreate={() => refetch()}
        />
      }
      {
        folderModal?.open &&
        <NewTemplateFolderModal
          {...folderModal}
          onCreate={() => refetch()}
          parent={last(folders).id} 
        />
      }
    </DocumentsLayout>
  );
};

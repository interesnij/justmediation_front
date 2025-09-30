import React, { useState, useRef } from "react";
import { SideModal } from "components";
import { useInput, useModal } from "hooks";
import {
  SearchBar,
  DropdownButton,
  Select,
  DocumentNav,
  Pagination,
  RiseLoader,
} from "components";
import { NewDocumentModal, VaultNewFolderModal } from "modals";
import { useQuery } from "react-query";
import { last } from "lodash";
import {
  getDocuments,
  getOnyDocuments,
  getOnyFolders,
  getDocumentImages,
  getDocumentVoices,
} from "api";
import { DocumentsTable } from "./components/DocumentsTable";
import { useAuthContext } from "contexts";
import "./style.scss";
import ReferenceSet from "yup/lib/util/ReferenceSet";

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

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
}
export const MyVaultModal = ({ open, setOpen }: Props) => {
    const search = useInput("");
    const page = useInput(0);
    const filter = useInput(filterData[0].id);
    const documentFolderModal = useModal();
    const documentModal = useModal();
    const [sorting, setSorting] = useState("");
    const { userId } = useAuthContext();
    const [folders, setFolders] = useState<any[]>([
      {
        id: undefined,
        title: "My Vault",
      },
    ]);
  
    const { isFetching, isFetched, isError, error, data, refetch } = useQuery<
      { results: any[]; overall_total: number },
      Error
    >(
      [
        "my-vaults",
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
              is_vault: true,
              owner: userId,
            })
          : filter.value === "documents"
          ? getOnyDocuments({
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              is_vault: true,
              owner: userId,
            })
          : filter.value === "folders"
          ? getOnyFolders({
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              is_vault: true,
              owner: userId,
            })
          : filter.value === "images"
          ? getDocumentImages({
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              is_vault: true,
              owner: userId,
            })
          : getDocumentVoices({
              page: page.value,
              search: search.value,
              parent: last(folders)?.id,
              is_parent: last(folders)?.id === undefined,
              ordering: sorting,
              is_vault: true,
              owner: userId,
            }),
  
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
    <SideModal
      title="My Vault"
      size="large"
      open={open}
      setOpen={setOpen}
    >
      <div className="documents-page__bar my-vault">
        <div className="documents-page__bar-input">
          <SearchBar
            icon="search"
            placeholder={`Search in My Vault`}
            {...search}
          />
        </div>
        <Select
          label="Filter by"
          className="documents-page__bar-filter"
          data={filterData}
          width={140}
          {...filter}
        />
        <DropdownButton
          className="ml-auto"
          menuData={menuData}
          onClick={handleNewClick}
        >
          New
        </DropdownButton>
      </div>
      <div className="my-documents-page__content my-vault flex-1">
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
      <VaultNewFolderModal
        {...documentFolderModal}
        parent={last(folders).id}
        onCreate={() => refetch()}
      />

      <NewDocumentModal {...documentModal} onCreate={() => refetch()} isVault />
    </SideModal>
  );
};

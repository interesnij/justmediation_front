import React, { useState } from "react";
import { DocumentNav, Button, FolderTree, RiseLoader } from "components";
import { useQuery } from "react-query";
import { getDocuments, createDocument } from "api";
import { last } from "lodash";
import { useInput } from "hooks";
import { uploadFiles } from "api";
import { useCommonUIContext } from "contexts";
import styled from "styled-components";
interface Props {
  files?: any[];
  onClose?(): void;
  onCreate?(): void;
  isTemplate?: boolean;
  matter?: number;
  client?: number;
  isVault?: boolean;
}

export const ChooseDestination = ({
  files = [],
  onClose = () => {},
  onCreate = () => {},
  isTemplate = false,
  matter,
  client,
  isVault,
}: Props) => {
  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: isTemplate ? "Templates" : "My Documents",
    },
  ]);
  const { showErrorModal } = useCommonUIContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedFolder = useInput({});
  const { data: folderData, isFetching: isFolderFetching, isFetched: isFolderFetched } = useQuery<
    { results: any[]; overall_total: number },
    Error
  >(
    ["new-file-documents", last(folders).id, matter, client],
    () =>
      getDocuments({
        pageSize: 1000,
        parent: last(folders)?.id,
        matter,
        client,
        isTemplate,
        is_vault: isVault,
      }),
    {
      keepPreviousData: true,
      enabled: files.length > 0,
    }
  );

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const urls = await uploadFiles(
        files, 
        "documents", 
        0 // непонятно, ошибка
      );
      //const urls = [];
      await Promise.all(
        urls.map((url, index) =>
          createDocument({
            parent: (selectedFolder.value?.id as number) || null,
            file: url,
            title: files[index].name,
            matter,
            client,
            is_template: isTemplate,
            is_vault: isVault,
          })
        )
      );
      setIsUploading(false);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onCreate();
      }, 5000);
    } catch (error: any) {
      showErrorModal("Error", error);
      setIsUploading(false);
    }
  };
  return (
    <Container>
      {isUploading ? (
        <div className="my-auto text-center">
          Uploading to the Blockchain...
          <RiseLoader className="mt-4" />
        </div>
      ) : isLoading ? (
        <RiseLoader className="my-auto" />
      ) : (
        <>
          <DocumentNav folders={folders} onClick={(e) => setFolders(e)} />
          <FolderTree
            className="mt-2"
            data={folderData?.results}
            isLoading={isFolderFetching && !isFolderFetched}
            onFolderClick={(e) => setFolders([...folders, e])}
            {...selectedFolder}
          />
          <div className="d-flex mt-3">
            <Button
              buttonType="button"
              className="ml-auto"
              theme="white"
              size="large"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="ml-3"
              buttonType="submit"
              size="large"
              isLoading={isLoading}
              onClick={() => handleUpload()}
            >
              Upload
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

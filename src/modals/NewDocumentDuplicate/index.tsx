/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modal, DocumentNav, Button, FolderTree } from "components";
import { getDocuments, duplicateDocument } from "api";
import { last } from "lodash";
import { useInput } from "hooks";
import { useQuery } from "react-query";
import { useCommonUIContext } from "contexts";

import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  isTemplate?: boolean;
  onCreate?(): void;
  parent?: string | number;
}
export const NewDocumentDuplicateModal = ({
  open,
  setOpen,
  parent,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};

  const [folders, setFolders] = useState<any[]>([
    {
      id: undefined,
      title: "Templates",
    },
  ]);
  const { showErrorModal } = useCommonUIContext();
  const [isLoading, setIsLoading] = useState(false);
  const selectedDocument = useInput({});
  const { data } = useQuery<{ results: any[]; overall_total: number }, Error>(
    ["new-file-documents", last(folders).id],
    () =>
      getDocuments({
        pageSize: 1000,
        parent: last(folders)?.id,
        isTemplate: true,
        is_parent: last(folders)?.id === undefined,
      }),
    {
      keepPreviousData: true,
      enabled: open,
    }
  );

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      await duplicateDocument(selectedDocument?.value?.id, {
        title: `Copy of ${selectedDocument?.value?.title}`,
        parent,
      });
      setIsLoading(false);
      setOpen(false);
      onCreate();
    } catch (error: any) {
      setIsLoading(false);
      showErrorModal("Error", error);
    }
  };

  useEffect(() => {
    if (open) {
      selectedDocument.onChange({});
    }
    return () => {};
  }, [open]);

  return (
    <Modal
      title={"Create from template"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <div className="new-message-modal">
        <DocumentNav folders={folders} onClick={(e) => setFolders(e)} />
        <FolderTree
          className="mt-2"
          data={data?.results}
          isFolderSelectable={false}
          onFolderClick={(e) => setFolders([...folders, e])}
          {...selectedDocument}
        />
        <div className="d-flex mt-3">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="ml-3"
            disabled={!selectedDocument.value?.id}
            buttonType="submit"
            size="large"
            isLoading={isLoading}
            onClick={() => handleUpload()}
          >
            Duplicate to current folder
          </Button>
        </div>
      </div>
    </Modal>
  );
};
